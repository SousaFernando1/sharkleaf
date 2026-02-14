import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, email, password } = body;

    if (!nome || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres" },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    const existente = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existente) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 400 }
      );
    }

    const senhaHash = await bcrypt.hash(password, 10);

    // Criar cliente e usuário em transação
    const resultado = await prisma.$transaction(async (tx) => {
      const cliente = await tx.cliente.create({
        data: {
          nome,
          email,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          email,
          senha: senhaHash,
          tipo: "CLIENTE",
          clienteId: cliente.id,
        },
      });

      return { cliente, usuario };
    });

    return NextResponse.json({
      success: true,
      message: "Conta criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta" },
      { status: 500 }
    );
  }
}

