import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User } from "lucide-react";

async function getProdutor() {
  return prisma.produtor.findFirst();
}

export default async function ConfigPage() {
  const produtor = await getProdutor();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Configurações gerais do sistema
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Perfil do Produtor */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Perfil do Produtor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {produtor ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{produtor.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{produtor.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{produtor.telefone || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{produtor.endereco || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{produtor.descricao || "—"}</p>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Perfil do produtor não configurado
              </p>
            )}
          </CardContent>
        </Card>

        {/* Regras do Sistema */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Regras do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Pontuação</p>
              <p className="font-medium">1 ponto por unidade de produto</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Brindes</p>
              <p className="font-medium">1 brinde a cada 100 pontos</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Títulos de Progressão
              </p>
              <div className="mt-1 space-y-1">
                <p className="text-sm">🌱 Plantador Novato: 0 - 100 pts</p>
                <p className="text-sm">🌿 Cultivador Engajado: 101 - 500 pts</p>
                <p className="text-sm">🌳 Mestre Florestal: 501+ pts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

