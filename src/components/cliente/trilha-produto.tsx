"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface TrilhaProdutoProps {
  produtoNome: string;
}

export function TrilhaProduto({ produtoNome }: TrilhaProdutoProps) {
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function consultarIA() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/trilha/${encodeURIComponent(produtoNome)}`
      );
      const data = await res.json();
      setInfo(data.info);
    } catch {
      setInfo("Não foi possível obter as informações neste momento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
          <Sparkles className="h-5 w-5" />
          Trilha do Produto — {produtoNome}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {info ? (
          <div className="whitespace-pre-wrap text-sm text-blue-900">
            {info}
          </div>
        ) : (
          <div className="text-center">
            <p className="mb-3 text-sm text-blue-600">
              Consulte informações sobre esta espécie usando inteligência
              artificial
            </p>
            <Button
              onClick={consultarIA}
              disabled={loading}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando IA...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Consultar Informações
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

