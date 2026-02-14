import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarCodigoBrinde, calcularBrindesDisponiveis } from "@/lib/helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.clienteId) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const cliente = await prisma.cliente.findUnique({
      where: { id: session.user.clienteId },
      include: { brindes: true },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      );
    }

    const disponiveis = calcularBrindesDisponiveis(
      cliente.pontosTotais,
      cliente.brindes.length
    );

    if (disponiveis <= 0) {
      return NextResponse.json(
        { error: "Você não tem brindes disponíveis para gerar" },
        { status: 400 }
      );
    }

    const brinde = await prisma.brinde.create({
      data: {
        codigo: gerarCodigoBrinde(),
        clienteId: cliente.id,
      },
    });

    return NextResponse.json(brinde, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao gerar brinde" },
      { status: 500 }
    );
  }
}

