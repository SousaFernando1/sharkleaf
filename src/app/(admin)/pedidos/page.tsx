export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, getStatusLabel } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye } from "lucide-react";

async function getPedidos() {
  return prisma.pedido.findMany({
    include: {
      itens: {
        include: {
          produto: true,
        },
      },
      cliente: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "RECEBIDO":
      return "outline" as const;
    case "PRODUCAO":
      return "secondary" as const;
    case "EMPACOTAMENTO":
      return "default" as const;
    case "PRONTO":
      return "default" as const;
    case "CANCELADO":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export default async function PedidosPage() {
  const pedidos = await getPedidos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">
            Gerencie os pedidos do viveiro
          </p>
        </div>
        <Link href="/pedidos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Pedido
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {pedidos.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum pedido encontrado. Crie o primeiro pedido!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.map((pedido) => (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-mono font-medium">
                      {pedido.ticket}
                    </TableCell>
                    <TableCell>
                      {pedido.itens
                        .map((i) => `${i.produto.nome} (${i.quantidade})`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>{formatarMoeda(pedido.valorTotal)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(pedido.status)}>
                        {getStatusLabel(pedido.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {pedido.cliente?.nome || "—"}
                    </TableCell>
                    <TableCell>{formatarData(pedido.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/pedidos/${pedido.id}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

