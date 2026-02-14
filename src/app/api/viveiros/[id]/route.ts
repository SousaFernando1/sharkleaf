import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, capacidade } = body;

    const viveiro = await prisma.viveiro.update({
      where: { id },
      data: {
        nome,
        capacidade: capacidade ? parseInt(capacidade) : undefined,
      },
    });

    return NextResponse.json(viveiro);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar viveiro" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Verificar se tem estoque
    const estoqueTotal = await prisma.estoqueViveiro.aggregate({
      where: { viveiroId: id },
      _sum: { quantidade: true },
    });

    if (estoqueTotal._sum.quantidade && estoqueTotal._sum.quantidade > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir viveiro com estoque" },
        { status: 400 }
      );
    }

    await prisma.viveiro.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir viveiro" },
      { status: 500 }
    );
  }
}

