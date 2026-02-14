"use client";

import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
            Nenhum pedido em produção no momento
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
            }) => (
              <Card
                key={pedido.id}
                className={`border-2 ${
                  pedido.status === "PRONTO"
                    ? "border-green-400 bg-green-950/50"
                    : "border-amber-400 bg-amber-950/30"
                }`}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-lg font-bold text-white">
                      #{pedido.ticket}
                    </span>
                    <Badge
                      variant={
                        pedido.status === "PRONTO" ? "default" : "secondary"
                      }
                      className={
                        pedido.status === "PRONTO"
                          ? "bg-green-600"
                          : "bg-amber-600"
                      }
                    >
                      {pedido.status === "PRONTO"
                        ? "✅ Pronto"
                        : "🔄 Em Produção"}
                    </Badge>
                  </div>
                  <p className="text-sm text-green-200">
                    {pedido.cliente || "Cliente não definido"}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      )}
    </div>
  );
}

