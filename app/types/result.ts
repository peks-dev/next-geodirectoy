// lib/types/result.ts

/**
 * Éxito genérico
 */
export type Success<T> = {
  success: true;
  data: T;
};

/**
 * Error genérico
 */
export type Failure = {
  success: false;
  error: {
    code: string; // Para matching programático
    message: string; // Para mostrar al usuario
    details?: unknown; // Para debugging (opcional)
    field?: string; // Para errores de validación (opcional)
  };
};

/**
 * Tipo unión para operaciones que pueden fallar
 */
export type Result<T> = Success<T> | Failure;

/**
 * Helpers para crear resultados
 */
export const ok = <T>(data: T): Success<T> => ({
  success: true,
  data,
});

export const fail = (
  code: string,
  message: string,
  details?: unknown,
  field?: string
): Failure => ({
  success: false,
  error: { code, message, details, field },
});
