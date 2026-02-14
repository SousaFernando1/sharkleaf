import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pedidos = await prisma.pedido.findMany({
      where: {
        status: { not: "CANCELADO" },
      },
      include: {
        itens: {
          include: { produto: true },
        },
        cliente: true,
      },
      orderBy: [
        { status: "asc" },
        { createdAt: "asc" },
      ],
    });

    const resultado = pedidos.map((p) => ({
      id: p.id,
      ticket: p.ticket,
      status: p.status,
      cliente: p.cliente?.nome || null,
      itens: p.itens.map((i) => `${i.produto.nome} (${i.quantidade})`),
    }));

    return NextResponse.json(resultado);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar pedidos" },
      { status: 500 }
    );
  }
}

