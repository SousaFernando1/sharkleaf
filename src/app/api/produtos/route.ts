import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        estoques: {
          include: { canteiro: true },
        },
      },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(produtos);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar produtos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, categoria, descricao, precoUnitario } = body;

    if (!nome) {
      return NextResponse.json(
        { error: "Nome é obrigatório" },
        { status: 400 }
      );
    }

    const produto = await prisma.produto.create({
      data: {
        nome,
        categoria: categoria || null,
        descricao: descricao || null,
        precoUnitario: precoUnitario || 0,
      },
    });

    return NextResponse.json(produto, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar produto" },
      { status: 500 }
    );
  }
}

