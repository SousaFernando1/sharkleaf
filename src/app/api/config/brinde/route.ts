import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const produtor = await prisma.produtor.findFirst();

    return NextResponse.json({
      brindeAtivo: produtor?.brindeAtivo ?? false,
      pontosParaBrinde: produtor?.pontosParaBrinde ?? 100,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar configuração de brinde" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { brindeAtivo, pontosParaBrinde } = body;

    if (typeof brindeAtivo !== "boolean") {
      return NextResponse.json(
        { error: "brindeAtivo deve ser um booleano" },
        { status: 400 },
      );
    }

    if (!Number.isInteger(pontosParaBrinde) || pontosParaBrinde < 1) {
      return NextResponse.json(
        {
          error:
            "pontosParaBrinde deve ser um número inteiro maior ou igual a 1",
        },
        { status: 400 },
      );
    }

    const produtorExistente = await prisma.produtor.findFirst();

    const produtor = produtorExistente
      ? await prisma.produtor.update({
          where: { id: produtorExistente.id },
          data: { brindeAtivo, pontosParaBrinde },
        })
      : await prisma.produtor.create({
          data: {
            nome: "Produtor",
            email: `produtor-${Date.now()}@sharkleaf.local`,
            brindeAtivo,
            pontosParaBrinde,
          },
        });

    return NextResponse.json({
      brindeAtivo: produtor.brindeAtivo,
      pontosParaBrinde: produtor.pontosParaBrinde,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar configuração de brinde" },
      { status: 500 },
    );
  }
}
