import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codigo } = body;

    if (!codigo) {
      return NextResponse.json(
        { error: "Código é obrigatório" },
        { status: 400 }
      );
    }

    const brinde = await prisma.brinde.findUnique({
      where: { codigo },
      include: { cliente: true },
    });

    if (!brinde) {
      return NextResponse.json(
        { error: "Código de brinde não encontrado", valido: false },
        { status: 404 }
      );
    }

    if (brinde.usado) {
      return NextResponse.json(
        { error: "Este código já foi utilizado", valido: false },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valido: true,
      codigo: brinde.codigo,
      cliente: brinde.cliente.nome,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao validar brinde" },
      { status: 500 }
    );
  }
}

