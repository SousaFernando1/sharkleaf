import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
          include: { cliente: true },
        });

        if (!usuario) {
          throw new Error("Email ou senha inválidos");
        }

        const senhaValida = await bcrypt.compare(
          credentials.password,
          usuario.senha
        );

        if (!senhaValida) {
          throw new Error("Email ou senha inválidos");
        }

        return {
          id: usuario.id,
          email: usuario.email,
          tipo: usuario.tipo,
          clienteId: usuario.clienteId,
          nome: usuario.cliente?.nome ?? "Admin",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.tipo = (user as any).tipo;
        token.clienteId = (user as any).clienteId;
        token.nome = (user as any).nome;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).tipo = token.tipo;
        (session.user as any).clienteId = token.clienteId;
        (session.user as any).nome = token.nome;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
};

