import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true,
            canteiros: { include: { canteiro: true } },
          },
        },
        cliente: true,
        escaneamentos: true,
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 }
    );
  }
}

// Atualizar status do pedido
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const statusValidos = [
      "RECEBIDO",
      "PRODUCAO",
      "EMPACOTAMENTO",
      "PRONTO",
      "CANCELADO",
    ];
    if (!statusValidos.includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    const pedidoAtual = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            canteiros: true,
          },
        },
      },
    });

    if (!pedidoAtual) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Se cancelar, reverter estoque e reabilitar brinde
    if (status === "CANCELADO" && pedidoAtual.status !== "CANCELADO") {
      await prisma.$transaction(async (tx) => {
        // Reverter estoque
        for (const item of pedidoAtual.itens) {
          for (const canteiro of item.canteiros) {
            const estoque = await tx.estoqueCanteiro.findUnique({
              where: {
                produtoId_canteiroId: {
                  produtoId: item.produtoId,
                  canteiroId: canteiro.canteiroId,
                },
              },
            });

            if (estoque) {
              await tx.estoqueCanteiro.update({
                where: { id: estoque.id },
                data: {
                  quantidade: estoque.quantidade + canteiro.quantidade,
                },
              });

              await tx.movimentacaoEstoque.create({
                data: {
                  tipo: "ENTRADA",
                  quantidade: canteiro.quantidade,
                  motivo: "CANCELAMENTO",
                  estoqueId: estoque.id,
                  pedidoId: id,
                },
              });
            }
          }
        }

        // Reabilitar brinde se foi usado neste pedido
        if (pedidoAtual.codigoBrinde) {
          await tx.brinde.update({
            where: { codigo: pedidoAtual.codigoBrinde },
            data: {
              usado: false,
              usadoEm: null,
              pedidoId: null,
            },
          });
        }

        // Se pontos foram resgatados, reverter
        if (pedidoAtual.resgatado && pedidoAtual.clienteId) {
          await tx.cliente.update({
            where: { id: pedidoAtual.clienteId },
            data: {
              pontosTotais: {
                decrement: pedidoAtual.pontosGerados,
              },
            },
          });
        }

        // Atualizar status
        await tx.pedido.update({
          where: { id },
          data: {
            status: "CANCELADO",
            resgatado: false,
            clienteId: null,
          },
        });
      });

      const pedidoAtualizado = await prisma.pedido.findUnique({
        where: { id },
        include: { itens: { include: { produto: true } } },
      });

      return NextResponse.json(pedidoAtualizado);
    }

    // Atualização simples de status
    const pedido = await prisma.pedido.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}

