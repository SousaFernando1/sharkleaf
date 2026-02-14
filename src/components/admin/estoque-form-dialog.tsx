"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface Produto {
  id: string;
  nome: string;
}

interface Viveiro {
  id: string;
  nome: string;
}

export function EstoqueFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [viveiros, setViveiros] = useState<Viveiro[]>([]);
  const [tipo, setTipo] = useState<string>("ENTRADA");
  const [produtoId, setProdutoId] = useState<string>("");
  const [viveiroId, setViveiroId] = useState<string>("");

  useEffect(() => {
    if (open) {
      fetch("/api/produtos")
        .then((r) => r.json())
        .then(setProdutos);
      fetch("/api/viveiros")
        .then((r) => r.json())
        .then(setViveiros);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      produtoId,
      canteiroId: viveiroId,
      quantidade: formData.get("quantidade") as string,
      tipo,
    };

    try {
      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Erro ao ajustar estoque");
        return;
      }

      toast.success(`Estoque ${tipo === "ENTRADA" ? "adicionado" : "removido"} com sucesso!`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro ao ajustar estoque");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajustar Estoque
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajuste Manual de Estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo *</Label>
            <Select value={tipo} onValueChange={setTipo}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ENTRADA">➕ Entrada</SelectItem>
                <SelectItem value="SAIDA">➖ Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Produto *</Label>
            <Select value={produtoId} onValueChange={setProdutoId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {produtos.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Viveiro *</Label>
            <Select value={viveiroId} onValueChange={setViveiroId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o viveiro" />
              </SelectTrigger>
              <SelectContent>
                {viveiros.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantidade">Quantidade *</Label>
            <Input
              id="quantidade"
              name="quantidade"
              type="number"
              min="1"
              required
              placeholder="Quantidade"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Confirmar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

