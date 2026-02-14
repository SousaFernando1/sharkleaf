import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gerarTicket } from "@/lib/helpers";

interface ItemInput {
  produtoId: string;
  quantidade: number;
  viveiros: { viveiroId: string; quantidade: number }[];
}

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      include: {
        itens: {
          include: { produto: true },
        },
        cliente: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pedidos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      itens,
      desconto,
      codigoBrinde,
    }: { itens: ItemInput[]; desconto?: number; codigoBrinde?: string } = body;

    if (!itens || itens.length === 0) {
      return NextResponse.json(
        { error: "O pedido deve ter pelo menos um item" },
        { status: 400 }
      );
    }

    const pedido = await prisma.$transaction(async (tx) => {
      // 1. Validar estoque e calcular valores
      let valorBruto = 0;
      let totalUnidades = 0;

      for (const item of itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        if (!produto) {
          throw new Error(`Produto ${item.produtoId} não encontrado`);
        }

        // Validar que as quantidades dos viveiros somam o total
        const totalViveiros = item.viveiros.reduce(
          (sum, v) => sum + v.quantidade,
          0
        );
        if (totalViveiros !== item.quantidade) {
          throw new Error(
            `A soma das quantidades dos viveiros (${totalViveiros}) não corresponde à quantidade do item (${item.quantidade}) para ${produto.nome}`
          );
        }

        // Validar estoque de cada viveiro
        for (const viveiro of item.viveiros) {
          const estoque = await tx.estoqueViveiro.findUnique({
            where: {
              produtoId_viveiroId: {
                produtoId: item.produtoId,
                viveiroId: viveiro.viveiroId,
              },
            },
          });

          if (!estoque || estoque.quantidade < viveiro.quantidade) {
            throw new Error(
              `Estoque insuficiente no viveiro para ${produto.nome}`
            );
          }
        }

        valorBruto += produto.precoUnitario * item.quantidade;
        totalUnidades += item.quantidade;
      }

      // 2. Validar código de brinde (se informado)
      if (codigoBrinde) {
        const brinde = await tx.brinde.findUnique({
          where: { codigo: codigoBrinde },
        });

        if (!brinde) {
          throw new Error("Código de brinde inválido");
        }

        if (brinde.usado) {
          throw new Error("Este código de brinde já foi utilizado");
        }
      }

      // 3. Calcular valor total com desconto
      const percentDesconto = desconto || 0;
      const valorDesconto = valorBruto * (percentDesconto / 100);
      const valorTotal = valorBruto - valorDesconto;

      // 4. Gerar ticket único
      let ticket = gerarTicket();
      let existeTicket = await tx.pedido.findUnique({
        where: { ticket },
      });
      while (existeTicket) {
        ticket = gerarTicket();
        existeTicket = await tx.pedido.findUnique({
          where: { ticket },
        });
      }

      // 5. Criar pedido (qrCode armazena apenas o ID — a URL é gerada dinamicamente)
      const novoPedido = await tx.pedido.create({
        data: {
          ticket,
          qrCode: `pedido_${ticket}`,
          valorTotal,
          desconto: percentDesconto,
          codigoBrinde: codigoBrinde || null,
          pontosGerados: totalUnidades, // 1 ponto por unidade
        },
      });

      // 6. Criar itens do pedido e atualizar estoque
      for (const item of itens) {
        const produto = await tx.produto.findUnique({
          where: { id: item.produtoId },
        });

        const itemPedido = await tx.itemPedido.create({
          data: {
            pedidoId: novoPedido.id,
            produtoId: item.produtoId,
            quantidade: item.quantidade,
            precoUnitario: produto!.precoUnitario,
            subtotal: produto!.precoUnitario * item.quantidade,
          },
        });

        for (const viveiro of item.viveiros) {
          // Criar vínculo item-viveiro
          await tx.itemPedidoViveiro.create({
            data: {
              itemPedidoId: itemPedido.id,
              viveiroId: viveiro.viveiroId,
              quantidade: viveiro.quantidade,
            },
          });

          // Baixar estoque
          const estoque = await tx.estoqueViveiro.findUnique({
            where: {
              produtoId_viveiroId: {
                produtoId: item.produtoId,
                viveiroId: viveiro.viveiroId,
              },
            },
          });

          await tx.estoqueViveiro.update({
            where: { id: estoque!.id },
            data: { quantidade: estoque!.quantidade - viveiro.quantidade },
          });

          // Registrar movimentação
          await tx.movimentacaoEstoque.create({
            data: {
              tipo: "SAIDA",
              quantidade: viveiro.quantidade,
              motivo: "PEDIDO",
              estoqueId: estoque!.id,
              pedidoId: novoPedido.id,
            },
          });
        }
      }

      // 7. Marcar brinde como usado
      if (codigoBrinde) {
        await tx.brinde.update({
          where: { codigo: codigoBrinde },
          data: {
            usado: true,
            usadoEm: new Date(),
            pedidoId: novoPedido.id,
          },
        });
      }

      return tx.pedido.findUnique({
        where: { id: novoPedido.id },
        include: {
          itens: {
            include: {
              produto: true,
              viveiros: { include: { viveiro: true } },
            },
          },
        },
      });
    });

    return NextResponse.json(pedido, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar pedido:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao criar pedido" },
      { status: 400 }
    );
  }
}
