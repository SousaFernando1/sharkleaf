import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const canteiros = await prisma.canteiro.findMany({
      include: {
        estoques: {
          include: { produto: true },
        },
      },
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(canteiros);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar canteiros" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, capacidade } = body;

    if (!nome || !capacidade) {
      return NextResponse.json(
        { error: "Nome e capacidade são obrigatórios" },
        { status: 400 }
      );
    }

    const canteiro = await prisma.canteiro.create({
      data: {
        nome,
        capacidade: parseInt(capacidade),
      },
    });

    return NextResponse.json(canteiro, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao criar canteiro" },
      { status: 500 }
    );
  }
}

