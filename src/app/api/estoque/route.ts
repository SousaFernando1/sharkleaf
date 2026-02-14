import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ajuste manual de estoque
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { produtoId, canteiroId, quantidade, tipo } = body;

    if (!produtoId || !canteiroId || quantidade === undefined || !tipo) {
      return NextResponse.json(
        {
          error:
            "produtoId, canteiroId, quantidade e tipo (ENTRADA/SAIDA) são obrigatórios",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      // Buscar ou criar registro de estoque
      let estoque = await tx.estoqueCanteiro.findUnique({
        where: {
          produtoId_canteiroId: { produtoId, canteiroId },
        },
      });

      if (!estoque) {
        estoque = await tx.estoqueCanteiro.create({
          data: {
            produtoId,
            canteiroId,
            quantidade: 0,
          },
        });
      }

      const qtd = parseInt(quantidade);
      const novaQuantidade =
        tipo === "ENTRADA"
          ? estoque.quantidade + qtd
          : estoque.quantidade - qtd;

      if (novaQuantidade < 0) {
        throw new Error("Estoque não pode ficar negativo");
      }

      // Atualizar estoque
      const estoqueAtualizado = await tx.estoqueCanteiro.update({
        where: { id: estoque.id },
        data: { quantidade: novaQuantidade },
      });

      // Registrar movimentação
      await tx.movimentacaoEstoque.create({
        data: {
          tipo,
          quantidade: qtd,
          motivo: "AJUSTE_MANUAL",
          estoqueId: estoque.id,
        },
      });

      return estoqueAtualizado;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Erro ao ajustar estoque" },
      { status: 400 }
    );
  }
}

