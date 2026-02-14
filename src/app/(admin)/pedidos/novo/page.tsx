"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Produto {
  id: string;
  nome: string;
  precoUnitario: number;
  estoques: { viveiroId: string; quantidade: number; viveiro: { id: string; nome: string } }[];
}

interface ViveiroSelecionado {
  viveiroId: string;
  nome: string;
  quantidade: number;
  estoqueDisponivel: number;
}

interface ItemPedido {
  produtoId: string;
  produtoNome: string;
  precoUnitario: number;
  quantidade: number;
  viveiros: ViveiroSelecionado[];
}

export default function NovoPedidoPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [desconto, setDesconto] = useState<string>("");
  const [codigoBrinde, setCodigoBrinde] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Produto sendo adicionado
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>("");

  useEffect(() => {
    fetch("/api/produtos")
      .then((r) => r.json())
      .then(setProdutos);
  }, []);

  function adicionarProduto() {
    if (!produtoSelecionado) return;

    const produto = produtos.find((p) => p.id === produtoSelecionado);
    if (!produto) return;

    // Verificar se já foi adicionado
    if (itens.some((i) => i.produtoId === produto.id)) {
      toast.error("Este produto já foi adicionado ao pedido");
      return;
    }

    // Preparar viveiros disponíveis
    const viveirosDisponiveis = produto.estoques
      .filter((e) => e.quantidade > 0)
      .map((e) => ({
        viveiroId: e.viveiroId,
        nome: e.viveiro.nome,
        quantidade: 0,
        estoqueDisponivel: e.quantidade,
      }));

    if (viveirosDisponiveis.length === 0) {
      toast.error("Este produto não tem estoque em nenhum viveiro");
      return;
    }

    setItens([
      ...itens,
      {
        produtoId: produto.id,
        produtoNome: produto.nome,
        precoUnitario: produto.precoUnitario,
        quantidade: 0,
        viveiros: viveirosDisponiveis,
      },
    ]);
    setProdutoSelecionado("");
  }

  function removerItem(index: number) {
    setItens(itens.filter((_, i) => i !== index));
  }

  function atualizarQuantidadeViveiro(
    itemIndex: number,
    viveiroIndex: number,
    quantidade: number
  ) {
    const novosItens = [...itens];
    const item = novosItens[itemIndex];
    item.viveiros[viveiroIndex].quantidade = Math.min(
      quantidade,
      item.viveiros[viveiroIndex].estoqueDisponivel
    );
    item.quantidade = item.viveiros.reduce((sum, c) => sum + c.quantidade, 0);
    setItens(novosItens);
  }

  const subtotal = itens.reduce(
    (sum, item) => sum + item.precoUnitario * item.quantidade,
    0
  );
  const descontoPercent = parseFloat(desconto) || 0;
  const valorDesconto = subtotal * (descontoPercent / 100);
  const valorTotal = subtotal - valorDesconto;
  const totalUnidades = itens.reduce((sum, item) => sum + item.quantidade, 0);

  async function handleSubmit() {
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um produto");
      return;
    }

    // Verificar se todos os itens tem quantidade > 0
    for (const item of itens) {
      if (item.quantidade === 0) {
        toast.error(`Defina a quantidade para ${item.produtoNome}`);
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        itens: itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: item.quantidade,
          viveiros: item.viveiros
            .filter((v) => v.quantidade > 0)
            .map((v) => ({
              viveiroId: v.viveiroId,
              quantidade: v.quantidade,
            })),
        })),
        desconto: descontoPercent || undefined,
        codigoBrinde: codigoBrinde || undefined,
      };

      const res = await fetch("/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Erro ao criar pedido");
        return;
      }

      const pedido = await res.json();
      toast.success(`Pedido #${pedido.ticket} criado com sucesso!`);
      router.push(`/pedidos/${pedido.id}`);
    } catch {
      toast.error("Erro ao criar pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/pedidos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Pedido</h1>
          <p className="text-muted-foreground">
            Monte o pedido adicionando produtos e definindo viveiros
          </p>
        </div>
      </div>

      {/* Adicionar Produto */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select
              value={produtoSelecionado}
              onValueChange={setProdutoSelecionado}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos
                  .filter((p) => !itens.some((i) => i.produtoId === p.id))
                  .map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.nome} — R${p.precoUnitario.toFixed(2)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button onClick={adicionarProduto} disabled={!produtoSelecionado}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Itens do Pedido */}
      {itens.map((item, itemIndex) => (
        <Card key={item.produtoId}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">{item.produtoNome}</CardTitle>
              <p className="text-sm text-muted-foreground">
                R${item.precoUnitario.toFixed(2)} / unidade — Total:{" "}
                {item.quantidade} un.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removerItem(itemIndex)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm font-medium">
              Definir quantidade por viveiro:
            </p>
            <div className="space-y-2">
              {item.viveiros.map((viveiro, viveiroIndex) => (
                <div
                  key={viveiro.viveiroId}
                  className="flex items-center gap-4 rounded-lg bg-muted/50 p-3"
                >
                  <div className="flex-1">
                    <p className="font-medium">{viveiro.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      Disponível: {viveiro.estoqueDisponivel}
                    </p>
                  </div>
                  <Input
                    type="number"
                    min="0"
                    max={viveiro.estoqueDisponivel}
                    value={viveiro.quantidade}
                    onChange={(e) =>
                      atualizarQuantidadeViveiro(
                        itemIndex,
                        viveiroIndex,
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-24"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Desconto e Brinde */}
      {itens.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Desconto e Brinde</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Código de Brinde (opcional)</Label>
                <Input
                  value={codigoBrinde}
                  onChange={(e) =>
                    setCodigoBrinde(e.target.value.toUpperCase())
                  }
                  placeholder="Ex: BRINDE-ABC123"
                />
              </div>
              <div className="space-y-2">
                <Label>Desconto (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={desconto}
                  onChange={(e) => setDesconto(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resumo */}
      {itens.length > 0 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R${subtotal.toFixed(2)}</span>
              </div>
              {descontoPercent > 0 && (
                <div className="flex justify-between text-destructive">
                  <span>Desconto ({descontoPercent}%)</span>
                  <span>-R${valorDesconto.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>R${valorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pontos que serão gerados</span>
                <span>{totalUnidades} pontos</span>
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="mt-4 w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {loading ? "Criando pedido..." : "Criar Pedido"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

