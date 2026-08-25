"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { toast } from "sonner";
import { USUARIO_TIPO } from "@/lib/enums/usuario-tipo.enum";
import { isSafeRedirectPath } from "@/lib/helpers";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrlParam = searchParams.get("callbackUrl");
  const callbackUrl = isSafeRedirectPath(callbackUrlParam)
    ? callbackUrlParam
    : null;
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // Read values directly from the form (works with any input method)
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      if (!email || !password) {
        toast.error("Preencha email e senha");
        setLoading(false);
        return;
      }

      // Get CSRF token
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = await csrfRes.json();

      // Login via NextAuth callback
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          csrfToken,
          email,
          password,
          json: "true",
        }),
        redirect: "manual",
      });

      // NextAuth returns 200 on success, 401 on failure
      // With redirect: "manual", successful auth returns 200 or 302
      if (res.status === 200 || res.type === "opaqueredirect") {
        // Navegação completa (não router.push) para o SessionProvider
        // remontar e buscar a sessão nova — client useSession() não
        // revalida sozinho após um login feito fora do signIn() do NextAuth
        if (callbackUrl) {
          window.location.href = callbackUrl;
        } else {
          // Buscar a sessão para determinar o tipo de usuário
          const sessionRes = await fetch("/api/auth/session");
          const session = await sessionRes.json();
          const destino =
            session?.user?.tipo === USUARIO_TIPO.ADMIN
              ? "/dashboard"
              : "/portal";
          window.location.href = destino;
        }
      } else {
        toast.error("Email ou senha inválidos");
      }
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="mx-auto mb-2 inline-flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-transform"
          aria-label="Ir para a página inicial"
          title="Ir para a página inicial"
        >
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-700">SharkLeaf</span>
        </Link>
        <CardTitle className="text-xl">Entrar no sistema</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            href={
              callbackUrl
                ? `/registro?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/registro"
            }
            className="font-medium text-green-600 hover:underline"
          >
            Criar conta
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <Suspense fallback={<div>Carregando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
