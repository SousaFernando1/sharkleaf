import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatarData, formatarMoeda, getStatusLabel } from "@/lib/helpers";
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
import { ClipboardList, User, ScanLine, Star } from "lucide-react";
import { PedidoStatusButtons } from "@/components/admin/pedido-status-buttons";
import { QRCodeDisplay } from "@/components/qr-code-display";
import { gerarQRCodeUrl } from "@/lib/helpers";

async function getPedido(id: string) {
  return prisma.pedido.findUnique({
    where: { id },
    include: {
      itens: {
        include: {
          produto: true,
          canteiros: {
            include: { canteiro: true },
          },
        },
      },
      cliente: true,
      escaneamentos: true,
    },
  });
}

export default async function PedidoDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pedido = await getPedido(id);

  if (!pedido) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pedido #{pedido.ticket}
          </h1>
          <p className="text-muted-foreground">
            Detalhes completos do pedido
          </p>
        </div>
        <PedidoStatusButtons pedidoId={pedido.id} statusAtual={pedido.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>{getStatusLabel(pedido.status)}</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">
              {pedido.cliente?.nome || "Pontos não resgatados"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
            <Star className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Pontos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pedido.pontosGerados}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {pedido.resgatado ? "(Resgatado)" : "(Pendente)"}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* QR Code do Pedido */}
      <div className="flex justify-center">
        <div className="w-full max-w-sm">
          <QRCodeDisplay
            url={gerarQRCodeUrl(pedido.id)}
            ticket={pedido.ticket}
          />
        </div>
      </div>

      {/* Itens do Pedido */}
      <Card>
        <CardHeader>
          <CardTitle>Itens do Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unit.</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Canteiros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedido.itens.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.produto.nome}
                  </TableCell>
                  <TableCell>{item.quantidade}</TableCell>
                  <TableCell>{formatarMoeda(item.precoUnitario)}</TableCell>
                  <TableCell>{formatarMoeda(item.subtotal)}</TableCell>
                  <TableCell>
                    {item.canteiros
                      .map((c) => `${c.canteiro.nome}: ${c.quantidade}`)
                      .join(", ")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end gap-4 border-t pt-4">
            {pedido.desconto && pedido.desconto > 0 && (
              <p className="text-sm text-muted-foreground">
                Desconto: {pedido.desconto}%
              </p>
            )}
            <p className="text-lg font-bold">
              Total: {formatarMoeda(pedido.valorTotal)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Escaneamentos */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <ScanLine className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Escaneamentos ({pedido.escaneamentos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {pedido.escaneamentos.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">
              Nenhum escaneamento registrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quem</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Data/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedido.escaneamentos.map((esc) => (
                  <TableRow key={esc.id}>
                    <TableCell>{esc.nome || "Visitante"}</TableCell>
                    <TableCell>{esc.localizacao || "—"}</TableCell>
                    <TableCell>{formatarData(esc.createdAt)}</TableCell>
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

