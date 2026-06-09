"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  PEDIDO_STATUS,
  PEDIDO_STATUS_FLUXO,
  type PedidoStatus,
  getPedidoStatusLabel,
} from "@/lib/enums/pedido-status.enum";

interface PedidoStatusButtonsProps {
  pedidoId: string;
  statusAtual: PedidoStatus;
}

export function PedidoStatusButtons({
  pedidoId,
  statusAtual,
}: PedidoStatusButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const currentIndex = PEDIDO_STATUS_FLUXO.indexOf(statusAtual);
  const nextStatus =
    currentIndex >= 0 && currentIndex < PEDIDO_STATUS_FLUXO.length - 1
      ? PEDIDO_STATUS_FLUXO[currentIndex + 1]
      : null;

  async function handleStatusChange(novoStatus: PedidoStatus) {
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

  if (
    statusAtual === PEDIDO_STATUS.CANCELADO ||
    statusAtual === PEDIDO_STATUS.PRONTO
  ) {
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
          {loading
            ? "Atualizando..."
            : `Avançar para ${getPedidoStatusLabel(nextStatus)}`}
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={() => handleStatusChange(PEDIDO_STATUS.CANCELADO)}
        disabled={loading}
      >
        Cancelar Pedido
      </Button>
    </div>
  );
}
