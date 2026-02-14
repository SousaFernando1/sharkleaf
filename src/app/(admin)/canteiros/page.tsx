import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CanteiroFormDialog } from "@/components/admin/canteiro-form-dialog";

async function getCanteiros() {
  return prisma.canteiro.findMany({
    include: {
      estoques: {
        include: { produto: true },
      },
    },
    orderBy: { nome: "asc" },
  });
}

export default async function CanteirosPage() {
  const canteiros = await getCanteiros();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Canteiros</h1>
          <p className="text-muted-foreground">
            Gerencie as áreas de cultivo
          </p>
        </div>
        <CanteiroFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Canteiros</CardTitle>
        </CardHeader>
        <CardContent>
          {canteiros.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum canteiro cadastrado. Adicione o primeiro canteiro!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Capacidade</TableHead>
                  <TableHead>Ocupação</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {canteiros.map((canteiro) => {
                  const ocupacaoTotal = canteiro.estoques.reduce(
                    (sum, e) => sum + e.quantidade,
                    0
                  );
                  return (
                    <TableRow key={canteiro.id}>
                      <TableCell className="font-medium">
                        {canteiro.nome}
                      </TableCell>
                      <TableCell>{canteiro.capacidade}</TableCell>
                      <TableCell>
                        {ocupacaoTotal}/{canteiro.capacidade}
                      </TableCell>
                      <TableCell>
                        {canteiro.estoques
                          .filter((e) => e.quantidade > 0)
                          .map((e) => `${e.produto.nome} (${e.quantidade})`)
                          .join(", ") || "—"}
                      </TableCell>
                      <TableCell>{formatarData(canteiro.createdAt)}</TableCell>
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

