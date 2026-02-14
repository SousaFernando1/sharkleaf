import { nanoid } from "nanoid";

/**
 * Gera um ticket alfanumérico curto e legível (ex: "ABC123")
 */
export function gerarTicket(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Sem I, O, 0, 1 para evitar confusão
  let ticket = "";
  for (let i = 0; i < 6; i++) {
    ticket += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ticket;
}

/**
 * Gera um código de brinde único (ex: "BRINDE-A3K9X2")
 */
export function gerarCodigoBrinde(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BRINDE-${code}`;
}

/**
 * Gera a URL do QR Code para um pedido.
 * Sempre usa o IP da rede local para que celulares na mesma rede consigam acessar.
 */
export function gerarQRCodeUrl(pedidoId: string): string {
  // Prioriza NEXTAUTH_URL se configurada com um IP real (não localhost)
  const envUrl = process.env.NEXTAUTH_URL || "";
  if (envUrl && !envUrl.includes("localhost")) {
    return `${envUrl}/rastreio/${pedidoId}`;
  }

  // Detecta o IP da rede automaticamente (server-side only)
  try {
    const os = require("os");
    const interfaces = os.networkInterfaces();

    // Nomes de adaptadores virtuais a ignorar
    const virtualPrefixes = ["vEthernet", "VirtualBox", "VMware", "Docker", "WSL", "br-", "veth"];

    let fallbackIP: string | null = null;

    for (const name of Object.keys(interfaces)) {
      const isVirtual = virtualPrefixes.some((p) => name.includes(p));
      for (const iface of interfaces[name] || []) {
        if (iface.family === "IPv4" && !iface.internal) {
          if (!isVirtual) {
            // Adaptador real (Wi-Fi, Ethernet) — usar imediatamente
            const port = process.env.PORT || "3000";
            return `http://${iface.address}:${port}/rastreio/${pedidoId}`;
          }
          // Guardar IP virtual como fallback
          if (!fallbackIP) fallbackIP = iface.address;
        }
      }
    }

    // Usar IP virtual se não encontrou adaptador real
    if (fallbackIP) {
      const port = process.env.PORT || "3000";
      return `http://${fallbackIP}:${port}/rastreio/${pedidoId}`;
    }
  } catch {
    // Fallback se não conseguir detectar
  }

  // Fallback para localhost
  const port = process.env.PORT || "3000";
  return `http://localhost:${port}/rastreio/${pedidoId}`;
}

/**
 * Calcula o título de progressão baseado nos pontos
 */
export function getTituloProgressao(pontos: number): {
  titulo: string;
  icone: string;
  minPontos: number;
  maxPontos: number | null;
} {
  if (pontos >= 501) {
    return {
      titulo: "Mestre Florestal",
      icone: "🌳",
      minPontos: 501,
      maxPontos: null,
    };
  }
  if (pontos >= 101) {
    return {
      titulo: "Cultivador Engajado",
      icone: "🌿",
      minPontos: 101,
      maxPontos: 500,
    };
  }
  return {
    titulo: "Plantador Novato",
    icone: "🌱",
    minPontos: 0,
    maxPontos: 100,
  };
}

/**
 * Formata valor em reais
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

/**
 * Formata data para o padrão brasileiro
 */
export function formatarData(data: Date | string): string {
  const d = typeof data === "string" ? new Date(data) : data;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Retorna o label legível do status do pedido
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    RECEBIDO: "Pedido Recebido",
    PRODUCAO: "Em Produção",
    EMPACOTAMENTO: "Empacotamento",
    PRONTO: "Concluído na Bancada",
    CANCELADO: "Cancelado",
  };
  return labels[status] || status;
}

/**
 * Retorna a cor do badge do status
 */
export function getStatusColor(
  status: string
): "default" | "secondary" | "destructive" | "outline" {
  const colors: Record<
    string,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    RECEBIDO: "outline",
    PRODUCAO: "secondary",
    EMPACOTAMENTO: "default",
    PRONTO: "default",
    CANCELADO: "destructive",
  };
  return colors[status] || "outline";
}

/**
 * Calcula quantos brindes um cliente pode gerar
 */
export function calcularBrindesDisponiveis(
  pontosTotais: number,
  brindesJaGerados: number
): number {
  const brindesPossiveis = Math.floor(pontosTotais / 100);
  return Math.max(0, brindesPossiveis - brindesJaGerados);
}

