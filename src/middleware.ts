import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Rotas admin: apenas usuários com tipo ADMIN
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/pedidos") || pathname.startsWith("/produtos") || pathname.startsWith("/clientes") || pathname.startsWith("/viveiros") || pathname.startsWith("/estoque") || pathname.startsWith("/config")) {
      if (token?.tipo !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Rotas do portal: apenas clientes logados
    if (pathname.startsWith("/portal")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Rotas públicas: rastreio, monitor, login, registro, API
        if (
          pathname.startsWith("/rastreio") ||
          pathname.startsWith("/monitor") ||
          pathname.startsWith("/login") ||
          pathname.startsWith("/registro") ||
          pathname.startsWith("/api") ||
          pathname === "/"
        ) {
          return true;
        }

        // Todas as outras rotas requerem autenticação
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Proteger todas as rotas exceto estáticas e API NextAuth
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};

