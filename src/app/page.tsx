import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, BarChart3, QrCode, Gift, TreePine } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Leaf className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-700">SharkLeaf</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/registro">
            <Button className="bg-green-600 hover:bg-green-700">
              Criar Conta
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-green-900 md:text-6xl">
          Gestão inteligente
          <br />
          <span className="text-green-600">para o seu viveiro</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Controle pedidos, estoque e canteiros com facilidade. Fidelize seus
          clientes com um sistema de gamificação único via QR Code.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Acessar Painel
            </Button>
          </Link>
          <Link href="/registro">
            <Button size="lg" variant="outline">
              Sou Cliente
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <TreePine className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Gestão de Canteiros</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Controle de áreas de cultivo e estoque setorial
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Dashboard</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Métricas de engajamento e visão geral do negócio
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <QrCode className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Rastreabilidade</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              QR Code único por pedido com trilha do produto
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
              <Gift className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold">Gamificação</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Pontos, títulos, medalhas e brindes para clientes
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>
          © 2026 SharkLeaf — Sistema de Gestão e Gamificação para Viveiros
        </p>
        <p className="mt-1">
          Desenvolvido por Diego Formentin & Fernando Sousa — TCC IFSC Tubarão
        </p>
      </footer>
    </div>
  );
}
