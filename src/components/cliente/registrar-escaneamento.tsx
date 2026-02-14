"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

interface RegistrarEscaneamentoProps {
  pedidoId: string;
}

export function RegistrarEscaneamento({ pedidoId }: RegistrarEscaneamentoProps) {
  const { data: session } = useSession();

  useEffect(() => {
    async function registrar() {
      try {
        // Tentar obter geolocalização (opcional)
        let localizacao: string | null = null;
        try {
          const pos = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 5000,
              });
            }
          );
          localizacao = `${pos.coords.latitude},${pos.coords.longitude}`;
        } catch {
          // Geolocalização não disponível, tudo bem
        }

        await fetch("/api/escaneamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pedidoId,
            localizacao,
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

