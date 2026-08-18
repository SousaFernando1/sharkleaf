export const MOVIMENTACAO_ESTOQUE_TIPO = {
  ENTRADA: "ENTRADA",
  SAIDA: "SAIDA",
} as const;

export type MovimentacaoEstoqueTipo =
  (typeof MOVIMENTACAO_ESTOQUE_TIPO)[keyof typeof MOVIMENTACAO_ESTOQUE_TIPO];

export function isMovimentacaoEstoqueTipo(
  valor: unknown,
): valor is MovimentacaoEstoqueTipo {
  return (
    valor === MOVIMENTACAO_ESTOQUE_TIPO.ENTRADA ||
    valor === MOVIMENTACAO_ESTOQUE_TIPO.SAIDA
  );
}
