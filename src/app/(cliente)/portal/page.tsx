export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getTituloProgressao,
  formatarData,
  formatarMoeda,
  getStatusLabel,
  calcularBrindesDisponiveis,
} from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Leaf, Award, Gift, Star, History } from "lucide-react";

async function getClienteData(clienteId: string) {
  const cliente = await prisma.cliente.findUnique({
    where: { id: clienteId },
    include: {
      brindes: {
        orderBy: { createdAt: "desc" },
      },
      pedidos: {
        include: {
          itens: { include: { produto: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      medalhas: {
        include: { medalha: true },
      },
    },
  });

  return cliente;
}

export default async function PortalPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.clienteId) {
    redirect("/login");
  }

  const cliente = await getClienteData(session.user.clienteId);

  if (!cliente) {
    redirect("/login");
  }

  const titulo = getTituloProgressao(cliente.pontosTotais);
  const brindesDisponiveis = calcularBrindesDisponiveis(
    cliente.pontosTotais,
    cliente.brindes.length
  );

  // Progresso para o próximo título
  const progressoAtual = titulo.maxPontos
    ? ((cliente.pontosTotais - titulo.minPontos) /
        (titulo.maxPontos - titulo.minPontos)) *
      100
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-green-700 px-4 py-8 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8" />
            <h1 className="text-2xl font-bold">SharkLeaf</h1>
          </div>
          <p className="mt-4 text-lg">Olá, {cliente.nome}! 👋</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 p-4">
        {/* Cards de Status */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-sm">Meus Pontos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">
                {cliente.pontosTotais}
              </p>
              <p className="text-sm text-muted-foreground">pontos acumulados</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Award className="h-5 w-5 text-green-600" />
              <CardTitle className="text-sm">Meu Título</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl">
                {titulo.icone} {titulo.titulo}
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all"
                  style={{ width: `${Math.min(progressoAtual, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-sm">Brindes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-purple-600">
                {brindesDisponiveis}
              </p>
              <p className="text-sm text-muted-foreground">
                disponíveis para gerar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Medalhas */}
        {cliente.medalhas.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Minhas Medalhas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {cliente.medalhas.map((mc) => (
                  <Badge
                    key={mc.id}
                    variant="outline"
                    className="px-3 py-2 text-sm"
                  >
                    {mc.medalha.icone} {mc.medalha.nome}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Códigos de Brinde */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Meus Códigos de Brinde
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cliente.brindes.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Você ainda não tem códigos de brinde. Acumule 100 pontos para
                ganhar o primeiro!
              </p>
            ) : (
              <div className="space-y-3">
                {cliente.brindes.map((brinde) => (
                  <div
                    key={brinde.id}
                    className={`flex items-center justify-between rounded-lg border p-3 ${
                      brinde.usado ? "bg-gray-50" : "bg-green-50 border-green-200"
                    }`}
                  >
                    <div>
                      <p className="font-mono text-lg font-bold">
                        {brinde.codigo}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Gerado em: {formatarData(brinde.createdAt)}
                      </p>
                    </div>
                    <Badge variant={brinde.usado ? "secondary" : "default"}>
                      {brinde.usado ? "✅ Utilizado" : "🎁 Disponível"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Histórico de Pedidos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Histórico de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cliente.pedidos.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">
                Você ainda não resgatou pontos de nenhum pedido
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Pontos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cliente.pedidos.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-mono font-medium">
                        {pedido.ticket}
                      </TableCell>
                      <TableCell>
                        {pedido.itens
                          .map((i) => `${i.produto.nome} (${i.quantidade})`)
                          .join(", ")}
                      </TableCell>
                      <TableCell>{pedido.pontosGerados}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {getStatusLabel(pedido.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatarData(pedido.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

