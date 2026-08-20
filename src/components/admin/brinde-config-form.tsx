"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";

interface BrindeConfigFormProps {
  brindeAtivoInicial: boolean;
  pontosParaBrindeInicial: number;
}

export function BrindeConfigForm({
  brindeAtivoInicial,
  pontosParaBrindeInicial,
}: BrindeConfigFormProps) {
  const router = useRouter();
  const [brindeAtivo, setBrindeAtivo] = useState(brindeAtivoInicial);
  const [pontosParaBrinde, setPontosParaBrinde] = useState(
    String(pontosParaBrindeInicial),
  );
  const [loading, setLoading] = useState(false);

  async function handleSalvar() {
    const pontos = parseInt(pontosParaBrinde, 10);

    if (!Number.isInteger(pontos) || pontos < 1) {
      toast.error("Informe um número inteiro maior ou igual a 1");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/config/brinde", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brindeAtivo, pontosParaBrinde: pontos }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Erro ao salvar configuração");
        return;
      }

      toast.success("Configuração de brinde salva com sucesso!");
      router.refresh();
    } catch {
      toast.error("Erro ao salvar configuração");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        O brinde é um marcador visual e promocional concedido por vontade
        exclusiva da loja (pode ser um produto grátis, desconto ou benefício
        especial). O cliente apresenta o código ao vendedor para o resgate,
        ficando a entrega sob responsabilidade do estabelecimento. Não gera
        desconto automático no pedido.
      </p>

      <div className="flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Recurso de brinde</p>
          <p className="text-xs text-muted-foreground">
            Desativar impede gerar ou usar brinde em novos pedidos. Brindes já
            emitidos não são afetados.
          </p>
        </div>
        <Button
          type="button"
          variant={brindeAtivo ? "default" : "outline"}
          className={brindeAtivo ? "bg-green-600 hover:bg-green-700" : ""}
          onClick={() => setBrindeAtivo(!brindeAtivo)}
        >
          {brindeAtivo ? (
            <>
              <ToggleRight className="h-4 w-4" />
              Ativado
            </>
          ) : (
            <>
              <ToggleLeft className="h-4 w-4" />
              Desativado
            </>
          )}
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pontosParaBrinde">Pontos necessários por brinde</Label>
        <Input
          id="pontosParaBrinde"
          type="number"
          min="1"
          step="1"
          value={pontosParaBrinde}
          onChange={(e) => setPontosParaBrinde(e.target.value)}
          className="max-w-40"
        />
      </div>

      <Button onClick={handleSalvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
}
