import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { UsuarioTipo } from "@/lib/enums/usuario-tipo.enum";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      tipo: UsuarioTipo;
      clienteId: string | null;
      nome: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    tipo: UsuarioTipo;
    clienteId: string | null;
    nome: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    tipo: UsuarioTipo;
    clienteId: string | null;
    nome: string;
  }
}
