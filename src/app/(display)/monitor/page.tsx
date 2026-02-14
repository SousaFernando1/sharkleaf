"use client";

import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const statusConfig: Record<string, { label: string; border: string; bg: string; badgeBg: string }> = {
  RECEBIDO: { label: "📋 Recebido", border: "border-blue-400", bg: "bg-blue-950/30", badgeBg: "bg-blue-600" },
  PRODUCAO: { label: "🔄 Em Produção", border: "border-amber-400", bg: "bg-amber-950/30", badgeBg: "bg-amber-600" },
  EMPACOTAMENTO: { label: "📦 Empacotamento", border: "border-orange-400", bg: "bg-orange-950/30", badgeBg: "bg-orange-600" },
  PRONTO: { label: "✅ Pronto", border: "border-green-400", bg: "bg-green-950/50", badgeBg: "bg-green-600" },
};

export default function MonitorPage() {
  const { data: pedidos, isLoading } = useSWR("/api/monitor", fetcher, {
    refreshInterval: 60000, // Atualiza a cada 60 segundos
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-950 p-6 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Leaf className="h-10 w-10 text-green-400" />
          <h1 className="text-4xl font-bold">SharkLeaf</h1>
        </div>
        <div className="text-right">
          <p className="text-lg text-green-300">Painel de Produção</p>
          <p className="text-sm text-green-400">
            Atualização automática a cada 60s
          </p>
        </div>
      </div>

      {/* Pedidos */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-green-300">Carregando pedidos...</p>
        </div>
      ) : !pedidos || pedidos.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-green-300">
            Nenhum pedido no momento
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pedidos.map(
            (pedido: {
              id: string;
              ticket: string;
              status: string;
              cliente: string | null;
              itens: string[];
            }) => {
              const config = statusConfig[pedido.status] || statusConfig.RECEBIDO;
              return (
                <Card
                  key={pedido.id}
                  className={`border-2 ${config.border} ${config.bg}`}
                >
                  <CardContent className="p-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-lg font-bold text-white">
                        #{pedido.ticket}
                      </span>
                      <Badge
                        variant="secondary"
                        className={config.badgeBg}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-green-200">
                      {pedido.cliente || "Cliente não definido"}
                    </p>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}

