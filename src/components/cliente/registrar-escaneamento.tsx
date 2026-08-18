"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface RegistrarEscaneamentoProps {
  pedidoId: string;
}

export function RegistrarEscaneamento({
  pedidoId,
}: RegistrarEscaneamentoProps) {
  useSession();

  useEffect(() => {
    async function registrar() {
      try {
        await fetch("/api/escaneamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pedidoId,
          }),
        });
      } catch {
        // Silenciosamente falha - não é crítico
      }
    }

    registrar();
  }, [pedidoId]);

  return null; // Componente invisível
}
