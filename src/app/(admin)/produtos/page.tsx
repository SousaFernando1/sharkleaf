export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { formatarMoeda, formatarData } from "@/lib/helpers";
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
import { ProdutoFormDialog } from "@/components/admin/produto-form-dialog";

async function getProdutos() {
  return prisma.produto.findMany({
    include: {
      estoques: {
        include: { viveiro: true },
      },
      _count: {
        select: { itensPedido: true },
      },
    },
    orderBy: { nome: "asc" },
  });
}

export default async function ProdutosPage() {
  const produtos = await getProdutos();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do viveiro
          </p>
        </div>
        <ProdutoFormDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          {produtos.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Nenhum produto cadastrado. Adicione o primeiro produto!
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Estoque Total</TableHead>
                  <TableHead>Pedidos</TableHead>
                  <TableHead>Criado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.map((produto) => {
                  const estoqueTotal = produto.estoques.reduce(
                    (sum, e) => sum + e.quantidade,
                    0
                  );
                  return (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium">
                        {produto.nome}
                      </TableCell>
                      <TableCell>{produto.categoria || "—"}</TableCell>
                      <TableCell>
                        {formatarMoeda(produto.precoUnitario)}
                      </TableCell>
                      <TableCell>{estoqueTotal}</TableCell>
                      <TableCell>{produto._count.itensPedido}</TableCell>
                      <TableCell>{formatarData(produto.createdAt)}</TableCell>
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

