import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tipo: string;
      clienteId: string | null;
      nome: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    tipo: string;
    clienteId: string | null;
    nome: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    tipo: string;
    clienteId: string | null;
    nome: string;
  }
}

