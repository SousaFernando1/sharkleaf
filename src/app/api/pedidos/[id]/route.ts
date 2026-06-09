import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isPedidoStatus, PEDIDO_STATUS } from "@/lib/enums/pedido-status.enum";
import { MOVIMENTACAO_ESTOQUE_TIPO } from "@/lib/enums/movimentacao-estoque-tipo.enum";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: true,
            viveiros: { include: { viveiro: true } },
          },
        },
        clienteResgate: true,
        escaneamentos: true,
      },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(pedido);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedido" },
      { status: 500 },
    );
  }
}

// Atualizar status do pedido
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!isPedidoStatus(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const pedidoAtual = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            viveiros: true,
          },
        },
      },
    });

    if (!pedidoAtual) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      );
    }

    // Se cancelar, reverter estoque e reabilitar brinde
    if (
      status === PEDIDO_STATUS.CANCELADO &&
      pedidoAtual.status !== PEDIDO_STATUS.CANCELADO
    ) {
      await prisma.$transaction(async (tx) => {
        // Reverter estoque
        for (const item of pedidoAtual.itens) {
          for (const viveiro of item.viveiros) {
            const estoque = await tx.estoqueViveiro.findUnique({
              where: {
                produtoId_viveiroId: {
                  produtoId: item.produtoId,
                  viveiroId: viveiro.viveiroId,
                },
              },
            });

            if (estoque) {
              await tx.estoqueViveiro.update({
                where: { id: estoque.id },
                data: {
                  quantidade: estoque.quantidade + viveiro.quantidade,
                },
              });

              await tx.movimentacaoEstoque.create({
                data: {
                  tipo: MOVIMENTACAO_ESTOQUE_TIPO.ENTRADA,
                  quantidade: viveiro.quantidade,
                  motivo: "CANCELAMENTO",
                  estoqueId: estoque.id,
                  pedidoId: id,
                },
              });
            }
          }
        }

        // Reabilitar brinde se foi usado neste pedido
        const brindeUsado = await tx.brinde.findFirst({
          where: { pedidoId: id },
        });

        if (brindeUsado) {
          await tx.brinde.update({
            where: { id: brindeUsado.id },
            data: {
              usado: false,
              usadoEm: null,
              pedidoId: null,
            },
          });
        }

        // Se pontos foram resgatados, reverter
        if (pedidoAtual.resgatado && pedidoAtual.clienteResgateId) {
          await tx.cliente.update({
            where: { id: pedidoAtual.clienteResgateId },
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
            status: PEDIDO_STATUS.CANCELADO,
            resgatado: false,
            clienteResgateId: null,
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
      { status: 500 },
    );
  }
}
