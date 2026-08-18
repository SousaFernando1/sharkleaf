export const USUARIO_TIPO = {
  ADMIN: "ADMIN",
  CLIENTE: "CLIENTE",
} as const;

export type UsuarioTipo = (typeof USUARIO_TIPO)[keyof typeof USUARIO_TIPO];

export function isUsuarioTipo(valor: unknown): valor is UsuarioTipo {
  return valor === USUARIO_TIPO.ADMIN || valor === USUARIO_TIPO.CLIENTE;
}
