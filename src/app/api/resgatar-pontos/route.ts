import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarCodigoBrinde } from "@/lib/helpers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.clienteId) {
      return NextResponse.json(
        { error: "Você precisa estar logado para resgatar pontos" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pedidoId } = body;

    if (!pedidoId) {
      return NextResponse.json(
        { error: "pedidoId é obrigatório" },
        { status: 400 }
      );
    }

    // Buscar pedido
    const pedido = await prisma.pedido.findUnique({
      where: { id: pedidoId },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    if (pedido.status !== "PRONTO") {
      return NextResponse.json(
        { error: "Só é possível resgatar pontos de pedidos com status PRONTO" },
        { status: 400 }
      );
    }

    if (pedido.resgatado) {
      return NextResponse.json(
        { error: "Os pontos deste pedido já foram resgatados" },
        { status: 400 }
      );
    }

    // Resgatar pontos em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // Marcar pedido como resgatado e associar ao cliente
      await tx.pedido.update({
        where: { id: pedidoId },
        data: {
          resgatado: true,
          clienteId: session.user.clienteId,
        },
      });

      // Atualizar pontos do cliente
      const clienteAtualizado = await tx.cliente.update({
        where: { id: session.user.clienteId! },
        data: {
          pontosTotais: { increment: pedido.pontosGerados },
        },
      });

      // Verificar se deve gerar brinde (a cada 100 pontos)
      const brindesExistentes = await tx.brinde.count({
        where: { clienteId: session.user.clienteId! },
      });

      const brindesPossiveis = Math.floor(
        clienteAtualizado.pontosTotais / 100
      );

      const brindesParaGerar = brindesPossiveis - brindesExistentes;

      // Gerar brindes necessários
      for (let i = 0; i < brindesParaGerar; i++) {
        await tx.brinde.create({
          data: {
            codigo: gerarCodigoBrinde(),
            clienteId: session.user.clienteId!,
          },
        });
      }

      return {
        pontosResgatados: pedido.pontosGerados,
        pontosTotais: clienteAtualizado.pontosTotais,
        brindesGerados: brindesParaGerar,
      };
    });

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("Erro ao resgatar pontos:", error);
    return NextResponse.json(
      { error: "Erro ao resgatar pontos" },
      { status: 500 }
    );
  }
}

