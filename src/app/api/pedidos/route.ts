import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gerarTicket, gerarQRCodeUrl } from "@/lib/helpers";

interface ItemInput {
  produtoId: string;
  quantidade: number;
  canteiros: { canteiroId: string; quantidade: number }[];
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

        // Validar que as quantidades dos canteiros somam o total
        const totalCanteiros = item.canteiros.reduce(
          (sum, c) => sum + c.quantidade,
          0
        );
        if (totalCanteiros !== item.quantidade) {
          throw new Error(
            `A soma das quantidades dos canteiros (${totalCanteiros}) não corresponde à quantidade do item (${item.quantidade}) para ${produto.nome}`
          );
        }

        // Validar estoque de cada canteiro
        for (const canteiro of item.canteiros) {
          const estoque = await tx.estoqueCanteiro.findUnique({
            where: {
              produtoId_canteiroId: {
                produtoId: item.produtoId,
                canteiroId: canteiro.canteiroId,
              },
            },
          });

          if (!estoque || estoque.quantidade < canteiro.quantidade) {
            throw new Error(
              `Estoque insuficiente no canteiro para ${produto.nome}`
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

      // 5. Criar pedido
      const novoPedido = await tx.pedido.create({
        data: {
          ticket,
          qrCode: "", // Será preenchido com o ID
          valorTotal,
          desconto: percentDesconto,
          codigoBrinde: codigoBrinde || null,
          pontosGerados: totalUnidades, // 1 ponto por unidade
        },
      });

      // Atualizar QR Code com a URL contendo o ID do pedido
      await tx.pedido.update({
        where: { id: novoPedido.id },
        data: { qrCode: gerarQRCodeUrl(novoPedido.id) },
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

        for (const canteiro of item.canteiros) {
          // Criar vínculo item-canteiro
          await tx.itemPedidoCanteiro.create({
            data: {
              itemPedidoId: itemPedido.id,
              canteiroId: canteiro.canteiroId,
              quantidade: canteiro.quantidade,
            },
          });

          // Baixar estoque
          const estoque = await tx.estoqueCanteiro.findUnique({
            where: {
              produtoId_canteiroId: {
                produtoId: item.produtoId,
                canteiroId: canteiro.canteiroId,
              },
            },
          });

          await tx.estoqueCanteiro.update({
            where: { id: estoque!.id },
            data: { quantidade: estoque!.quantidade - canteiro.quantidade },
          });

          // Registrar movimentação
          await tx.movimentacaoEstoque.create({
            data: {
              tipo: "SAIDA",
              quantidade: canteiro.quantidade,
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
              canteiros: { include: { canteiro: true } },
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

