export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, getStatusLabel } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, CheckCircle2, Circle, Package, Truck, Gift } from "lucide-react";
import { ResgatarPontosButton } from "@/components/cliente/resgatar-pontos-button";
import { RegistrarEscaneamento } from "@/components/cliente/registrar-escaneamento";
import { TrilhaProduto } from "@/components/cliente/trilha-produto";

const statusSteps = [
  { key: "RECEBIDO", label: "Pedido Recebido", icon: CheckCircle2 },
  { key: "PRODUCAO", label: "Em Produção", icon: Package },
  { key: "EMPACOTAMENTO", label: "Empacotamento", icon: Truck },
  { key: "PRONTO", label: "Concluído na Bancada", icon: Gift },
];

async function getPedido(id: string) {
  return prisma.pedido.findUnique({
    where: { id },
    include: {
      itens: {
        include: { produto: true },
      },
      cliente: true,
    },
  });
}

export default async function RastreioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await getPedido(id);

  if (!pedido) {
    notFound();
  }

  const statusIndex = statusSteps.findIndex((s) => s.key === pedido.status);
  const isCancelado = pedido.status === "CANCELADO";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Registrar escaneamento */}
      <RegistrarEscaneamento pedidoId={pedido.id} />

      {/* Header */}
      <div className="bg-green-700 px-4 py-8 text-center text-white">
        <div className="flex items-center justify-center gap-2">
          <Leaf className="h-8 w-8" />
          <h1 className="text-2xl font-bold">SharkLeaf</h1>
        </div>
        <p className="mt-2 text-green-200">Rastreamento do Pedido</p>
        <p className="mt-1 font-mono text-xl font-bold">#{pedido.ticket}</p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6 p-4">
        {/* Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {isCancelado ? (
              <div className="py-4 text-center">
                <Badge variant="destructive" className="text-lg">
                  ❌ Pedido Cancelado
                </Badge>
              </div>
            ) : (
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= statusIndex;
                  const isCurrent = index === statusIndex;
                  const StepIcon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center gap-4">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${
                            isCompleted
                              ? "text-green-700"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Produtos do Pedido */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pedido.itens.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-green-50 p-3"
                >
                  <div>
                    <p className="font-medium">{item.produto.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.produto.categoria || "Sem categoria"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{item.quantidade} un.</p>
                    <p className="text-sm text-muted-foreground">
                      {formatarMoeda(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end border-t pt-3">
              {pedido.desconto && pedido.desconto > 0 && (
                <p className="mr-4 text-sm text-muted-foreground">
                  Desconto: {pedido.desconto}%
                </p>
              )}
              <p className="text-lg font-bold">
                Total: {formatarMoeda(pedido.valorTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Trilha dos Produtos */}
        {pedido.itens.map((item) => (
          <TrilhaProduto key={item.id} produtoNome={item.produto.nome} />
        ))}

        {/* Resgate de Pontos */}
        {pedido.status === "PRONTO" && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg text-green-700">
                🎁 Resgate seus Pontos!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-green-600">
                Este pedido vale{" "}
                <span className="font-bold">{pedido.pontosGerados} pontos</span>
                . Faça login e resgate!
              </p>
              <ResgatarPontosButton
                pedidoId={pedido.id}
                pontos={pedido.pontosGerados}
                resgatado={pedido.resgatado}
              />
            </CardContent>
          </Card>
        )}

        {/* Info do Pedido */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Criado em: {formatarData(pedido.createdAt)}</span>
              <span>Pontos: {pedido.pontosGerados}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

