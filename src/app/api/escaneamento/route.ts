import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { pedidoId, localizacao } = body;

    if (!pedidoId) {
      return NextResponse.json(
        { error: "pedidoId é obrigatório" },
        { status: 400 }
      );
    }

    const headerList = await headers();
    const ip =
      headerList.get("x-forwarded-for") ||
      headerList.get("x-real-ip") ||
      "desconhecido";
    const userAgent = headerList.get("user-agent") || "desconhecido";

    await prisma.escaneamentoQR.create({
      data: {
        pedidoId,
        clienteId: session?.user?.clienteId || null,
        nome: session?.user?.nome || "Visitante",
        localizacao: localizacao || null,
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao registrar escaneamento" },
      { status: 500 }
    );
  }
}

