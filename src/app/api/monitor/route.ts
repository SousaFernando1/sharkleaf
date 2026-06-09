import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getPedidoStatusIndex,
  normalizarPedidoStatus,
  PEDIDO_STATUS,
} from "@/lib/enums/pedido-status.enum";

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        status: { not: PEDIDO_STATUS.CANCELADO },
      },
      include: {
        itens: {
          include: { produto: true },
        },
        clienteResgate: true,
      },
      orderBy: [{ createdAt: "asc" }],
    });

    const resultado = pedidos
      .map((p) => ({
        id: p.id,
        ticket: p.ticket,
        status: normalizarPedidoStatus(p.status),
        cliente: p.clienteResgate?.nome || null,
        itens: p.itens.map((i) => `${i.produto.nome} (${i.quantidade})`),
        createdAt: p.createdAt,
      }))
      .sort((a, b) => {
        const statusCompare =
          getPedidoStatusIndex(a.status) - getPedidoStatusIndex(b.status);

        if (statusCompare !== 0) {
          return statusCompare;
        }

        return a.createdAt.getTime() - b.createdAt.getTime();
      })
      .map(({ createdAt, ...pedido }) => pedido);

    return NextResponse.json(resultado);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 },
    );
  }
}
