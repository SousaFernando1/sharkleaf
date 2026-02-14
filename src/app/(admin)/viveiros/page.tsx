export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatarData } from "@/lib/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViveiroFormDialog } from "@/components/admin/viveiro-form-dialog";

async function getViveiros() {
  return prisma.canteiro.findMany({
    include: {
      estoques: {
        include: { produto: true },
      },
    },
    orderBy: { nome: "asc" },
  });
}

export default async function ViveirosPage() {
  const viveiros = await getViveiros();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Viveiros</h1>
          <p className="text-muted-foreground">
            Gerencie as áreas de cultivo
          </p>
        </div>
        <ViveiroFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Viveiros</CardTitle>
        </CardHeader>
        <CardContent>
          {viveiros.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum viveiro cadastrado. Adicione o primeiro viveiro!
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {viveiros.map((viveiro) => {
                  const ocupacaoTotal = viveiro.estoques.reduce(
                    (sum, e) => sum + e.quantidade,
                    0
                  );
                  return (
                    <TableRow key={viveiro.id}>
                      <TableCell className="font-medium">
                        {viveiro.nome}
                      </TableCell>
                      <TableCell>{viveiro.capacidade}</TableCell>
                      <TableCell>
                        {ocupacaoTotal}/{viveiro.capacidade}
                      </TableCell>
                      <TableCell>
                        {viveiro.estoques
                          .filter((e) => e.quantidade > 0)
                          .map((e) => `${e.produto.nome} (${e.quantidade})`)
                          .join(", ") || "—"}
                      </TableCell>
                      <TableCell>{formatarData(viveiro.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <ViveiroFormDialog
                          viveiro={{
                            id: viveiro.id,
                            nome: viveiro.nome,
                            capacidade: viveiro.capacidade,
                          }}
                        />
                      </TableCell>
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

