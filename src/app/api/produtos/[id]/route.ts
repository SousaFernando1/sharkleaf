import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        estoques: {
          include: { viveiro: true },
        },
      },
    });

    if (!produto) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(produto);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { nome, categoria, descricao, precoUnitario } = body;

    const produto = await prisma.produto.update({
      where: { id },
      data: {
        nome,
        categoria: categoria || null,
        descricao: descricao || null,
        precoUnitario: precoUnitario ?? undefined,
      },
    });

    return NextResponse.json(produto);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao atualizar produto" },
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
      where: { produtoId: id },
      _sum: { quantidade: true },
    });

    if (estoqueTotal._sum.quantidade && estoqueTotal._sum.quantidade > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir produto com estoque" },
        { status: 400 }
      );
    }

    await prisma.produto.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao excluir produto" },
      { status: 500 }
    );
  }
}

