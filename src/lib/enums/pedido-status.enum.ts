export const PEDIDO_STATUS = {
  RECEBIDO: "RECEBIDO",
  PRODUCAO: "PRODUCAO",
  EMPACOTAMENTO: "EMPACOTAMENTO",
  PRONTO: "PRONTO",
  CANCELADO: "CANCELADO",
} as const;

export type PedidoStatus = (typeof PEDIDO_STATUS)[keyof typeof PEDIDO_STATUS];

export const PEDIDO_STATUS_FLUXO: PedidoStatus[] = [
  PEDIDO_STATUS.RECEBIDO,
  PEDIDO_STATUS.PRODUCAO,
  PEDIDO_STATUS.EMPACOTAMENTO,
  PEDIDO_STATUS.PRONTO,
];

const PEDIDO_STATUS_LABELS: Record<PedidoStatus, string> = {
  RECEBIDO: "Pedido Recebido",
  PRODUCAO: "Em Produção",
  EMPACOTAMENTO: "Empacotamento",
  PRONTO: "Concluído na Bancada",
  CANCELADO: "Cancelado",
};

const PEDIDO_STATUS_BADGE_VARIANTS: Record<
  PedidoStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  RECEBIDO: "outline",
  PRODUCAO: "secondary",
  EMPACOTAMENTO: "default",
  PRONTO: "default",
  CANCELADO: "destructive",
};

export function isPedidoStatus(valor: unknown): valor is PedidoStatus {
  return typeof valor === "string" && valor in PEDIDO_STATUS_LABELS;
}

export function normalizarPedidoStatus(valor: unknown): PedidoStatus {
  return isPedidoStatus(valor) ? valor : PEDIDO_STATUS.RECEBIDO;
}

export function getPedidoStatusLabel(valor: unknown): string {
  const status = normalizarPedidoStatus(valor);
  return PEDIDO_STATUS_LABELS[status];
}

export function getPedidoStatusBadgeVariant(
  valor: unknown,
): "default" | "secondary" | "destructive" | "outline" {
  const status = normalizarPedidoStatus(valor);
  return PEDIDO_STATUS_BADGE_VARIANTS[status];
}

export function getPedidoStatusIndex(valor: unknown): number {
  const status = normalizarPedidoStatus(valor);
  const index = PEDIDO_STATUS_FLUXO.indexOf(status);
  return index >= 0 ? index : 0;
}
