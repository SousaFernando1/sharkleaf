"use client";

import { useState } from "react";
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
import { Plus, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ViveiroData {
  id: string;
  nome: string;
  capacidade: number;
}

interface ViveiroFormDialogProps {
  viveiro?: ViveiroData;
}

export function ViveiroFormDialog({ viveiro }: ViveiroFormDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEditing = !!viveiro;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      nome: formData.get("nome") as string,
      capacidade: formData.get("capacidade") as string,
    };

    try {
      const url = isEditing ? `/api/viveiros/${viveiro.id}` : "/api/viveiros";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || `Erro ao ${isEditing ? "atualizar" : "criar"} viveiro`);
        return;
      }

      toast.success(`Viveiro ${isEditing ? "atualizado" : "criado"} com sucesso!`);
      setOpen(false);
      router.refresh();
    } catch {
      toast.error(`Erro ao ${isEditing ? "atualizar" : "criar"} viveiro`);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!viveiro) return;
    if (!confirm("Tem certeza que deseja excluir este viveiro?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/viveiros/${viveiro.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir viveiro");
        return;
      }

      toast.success("Viveiro excluído com sucesso!");
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro ao excluir viveiro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Viveiro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Viveiro" : "Novo Viveiro"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              name="nome"
              required
              defaultValue={viveiro?.nome || ""}
              placeholder="Ex: Viveiro Norte"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capacidade">Capacidade (mudas) *</Label>
            <Input
              id="capacidade"
              name="capacidade"
              type="number"
              min="1"
              required
              defaultValue={viveiro?.capacidade || ""}
              placeholder="Ex: 5000"
            />
          </div>
          <div className="flex justify-between">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Excluir
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Salvando..."
                  : isEditing
                    ? "Salvar Alterações"
                    : "Criar Viveiro"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

