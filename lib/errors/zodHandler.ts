import { z } from 'zod';
import { ErrorCodes } from './codes';

/**
 * Error de validación personalizado
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public code: keyof typeof ErrorCodes,
    public field?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Convierte un ZodError a ValidationError
 * Toma el primer error de Zod y lo transforma
 */
export function fromZodError(error: z.ZodError): ValidationError {
  const firstError = error.issues[0];

  return new ValidationError(
    firstError.message,
    ErrorCodes.VALIDATION_ERROR,
    firstError.path.join('.'),
    error.issues // Todos los errores para debugging
  );
}

/**
 * Valida datos con un schema de Zod
 * Si falla, lanza ValidationError
 * Si pasa, devuelve los datos parseados
 *
 * @example
 * const validated = validateOrThrow(contributionSchema, formData);
 * // validated es type-safe aquí
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw fromZodError(result.error);
  }

  return result.data;
}

/**
 * Versión async del helper anterior
 * Útil para schemas con validaciones asíncronas
 */
export async function validateOrThrowAsync<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  const result = await schema.safeParseAsync(data);

  if (!result.success) {
    throw fromZodError(result.error);
  }

  return result.data;
}
