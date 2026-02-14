"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PedidoStatusButtonsProps {
  pedidoId: string;
  statusAtual: string;
}

const fluxoStatus = ["RECEBIDO", "PRODUCAO", "EMPACOTAMENTO", "PRONTO"];
const statusLabels: Record<string, string> = {
  RECEBIDO: "Pedido Recebido",
  PRODUCAO: "Em Produção",
  EMPACOTAMENTO: "Empacotamento",
  PRONTO: "Concluído na Bancada",
  CANCELADO: "Cancelado",
};

export function PedidoStatusButtons({
  pedidoId,
  statusAtual,
}: PedidoStatusButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentIndex = fluxoStatus.indexOf(statusAtual);
  const nextStatus =
    currentIndex >= 0 && currentIndex < fluxoStatus.length - 1
      ? fluxoStatus[currentIndex + 1]
      : null;

  async function handleStatusChange(novoStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Erro ao atualizar status");
        return;
      }

      router.refresh();
    } catch {
      toast.error("Erro ao atualizar status");
    } finally {
      setLoading(false);
    }
  }

  if (statusAtual === "CANCELADO" || statusAtual === "PRONTO") {
    return null;
  }

  return (
    <div className="flex gap-2">
      {nextStatus && (
        <Button
          onClick={() => handleStatusChange(nextStatus)}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Atualizando..." : `Avançar para ${statusLabels[nextStatus]}`}
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={() => handleStatusChange("CANCELADO")}
        disabled={loading}
      >
        Cancelar Pedido
      </Button>
    </div>
  );
}

