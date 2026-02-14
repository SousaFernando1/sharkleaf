export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatarData, getTituloProgressao } from "@/lib/helpers";
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

async function getClientes() {
  return prisma.cliente.findMany({
    include: {
      _count: {
        select: { pedidos: true, brindes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function ClientesPage() {
  const clientes = await getClientes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        <p className="text-muted-foreground">
          Visualize os clientes cadastrados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum cliente cadastrado
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Brindes</TableHead>
                  <TableHead>Desde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => {
                  const titulo = getTituloProgressao(cliente.pontosTotais);
                  return (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">
                        {cliente.nome}
                      </TableCell>
                      <TableCell>{cliente.email}</TableCell>
                      <TableCell>{cliente.pontosTotais}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {titulo.icone} {titulo.titulo}
                        </Badge>
                      </TableCell>
                      <TableCell>{cliente._count.pedidos}</TableCell>
                      <TableCell>{cliente._count.brindes}</TableCell>
                      <TableCell>{formatarData(cliente.createdAt)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

