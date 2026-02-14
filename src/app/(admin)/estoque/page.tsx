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
import { Badge } from "@/components/ui/badge";
import { EstoqueFormDialog } from "@/components/admin/estoque-form-dialog";

async function getEstoque() {
  const estoques = await prisma.estoqueCanteiro.findMany({
    include: {
      produto: true,
      canteiro: true,
    },
    orderBy: [{ produto: { nome: "asc" } }, { canteiro: { nome: "asc" } }],
  });

  const movimentacoes = await prisma.movimentacaoEstoque.findMany({
    include: {
      estoque: {
        include: {
          produto: true,
          canteiro: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return { estoques, movimentacoes };
}

export default async function EstoquePage() {
  const { estoques, movimentacoes } = await getEstoque();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
          <p className="text-muted-foreground">
            Gestão de estoque por produto e canteiro
          </p>
        </div>
        <EstoqueFormDialog />
      </div>

      {/* Estoque por Produto/Canteiro */}
      <Card>
        <CardHeader>
          <CardTitle>Estoque por Produto e Canteiro</CardTitle>
        </CardHeader>
        <CardContent>
          {estoques.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum estoque cadastrado. Adicione produtos aos canteiros!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Canteiro</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Atualizado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estoques.map((estoque) => (
                  <TableRow key={estoque.id}>
                    <TableCell className="font-medium">
                      {estoque.produto.nome}
                    </TableCell>
                    <TableCell>{estoque.canteiro.nome}</TableCell>
                    <TableCell>{estoque.quantidade}</TableCell>
                    <TableCell>{formatarData(estoque.updatedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Últimas Movimentações */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Movimentações</CardTitle>
        </CardHeader>
        <CardContent>
          {movimentacoes.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhuma movimentação registrada
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Canteiro</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Motivo</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimentacoes.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell>
                      <Badge
                        variant={
                          mov.tipo === "ENTRADA" ? "default" : "destructive"
                        }
                      >
                        {mov.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>{mov.estoque.produto.nome}</TableCell>
                    <TableCell>{mov.estoque.canteiro.nome}</TableCell>
                    <TableCell>{mov.quantidade}</TableCell>
                    <TableCell>{mov.motivo || "—"}</TableCell>
                    <TableCell>{formatarData(mov.createdAt)}</TableCell>
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

