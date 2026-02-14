export const dynamic = "force-dynamic";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  ClipboardList,
  Package,
  Users,
  QrCode,
  TrendingUp,
  Award,
} from "lucide-react";

async function getDashboardData() {
  const [
    totalPedidos,
    pedidosProducao,
    pedidosProntos,
    totalProdutos,
    totalClientes,
    totalEscaneamentos,
    pedidosResgatados,
  ] = await Promise.all([
    prisma.pedido.count({ where: { status: { not: "CANCELADO" } } }),
    prisma.pedido.count({ where: { status: "PRODUCAO" } }),
    prisma.pedido.count({ where: { status: "PRONTO" } }),
    prisma.produto.count(),
    prisma.cliente.count(),
    prisma.escaneamentoQR.count(),
    prisma.pedido.count({ where: { resgatado: true } }),
  ]);

  const taxaEngajamento =
    totalPedidos > 0
      ? ((totalEscaneamentos / totalPedidos) * 100).toFixed(1)
      : "0";

  const taxaResgate =
    totalPedidos > 0
      ? ((pedidosResgatados / totalPedidos) * 100).toFixed(1)
      : "0";

  return {
    totalPedidos,
    pedidosProducao,
    pedidosProntos,
    totalProdutos,
    totalClientes,
    totalEscaneamentos,
    taxaEngajamento,
    taxaResgate,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const cards = [
    {
      title: "Total de Pedidos",
      value: data.totalPedidos,
      icon: ClipboardList,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Em Produção",
      value: data.pedidosProducao,
      icon: Package,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Prontos",
      value: data.pedidosProntos,
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Clientes",
      value: data.totalClientes,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Escaneamentos",
      value: data.totalEscaneamentos,
      icon: QrCode,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Taxa de Engajamento",
      value: `${data.taxaEngajamento}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do seu viveiro
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Taxa de Resgate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {data.taxaResgate}%
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              dos pedidos tiveram pontos resgatados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Produtos Cadastrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {data.totalProdutos}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              produtos no sistema
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

