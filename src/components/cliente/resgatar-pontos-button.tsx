"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ResgatarPontosButtonProps {
  pedidoId: string;
  pontos: number;
  resgatado: boolean;
}

export function ResgatarPontosButton({
  pedidoId,
  pontos,
  resgatado,
}: ResgatarPontosButtonProps) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [jaResgatado, setJaResgatado] = useState(resgatado);

  if (jaResgatado) {
    return (
      <Button disabled className="w-full">
        ✅ Pontos já resgatados
      </Button>
    );
  }

  if (status === "loading") {
    return (
      <Button disabled className="w-full">
        Carregando...
      </Button>
    );
  }

  if (!session) {
    return (
      <Button
        onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Fazer Login para Resgatar {pontos} Pontos
      </Button>
    );
  }

  async function handleResgatar() {
    setLoading(true);
    try {
      const res = await fetch("/api/resgatar-pontos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pedidoId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao resgatar pontos");
        return;
      }

      setJaResgatado(true);
      toast.success(`🎉 ${pontos} pontos resgatados com sucesso!`);
    } catch (error) {
      toast.error("Erro ao resgatar pontos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleResgatar}
      disabled={loading}
      className="w-full bg-green-600 hover:bg-green-700"
    >
      {loading ? "Resgatando..." : `🎁 Resgatar ${pontos} Pontos`}
    </Button>
  );
}

