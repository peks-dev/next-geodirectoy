import type { ValidationResult } from '../core/types';

/**
 * Validador genérico de esquema básico
 * Verifica que un objeto tenga las propiedades especificadas con sus tipos
 */
export function validateSchema<T>(
  data: unknown,
  schema: Record<keyof T, string>
): ValidationResult<T> {
  if (typeof data !== 'object' || data === null) {
    return {
      success: false,
      errors: ['La respuesta no es un objeto válido'],
    };
  }

  const errors: string[] = [];
  const dataObj = data as Record<string, unknown>;

  for (const [key, expectedType] of Object.entries(schema)) {
    const value = dataObj[key];
    const actualType = Array.isArray(value) ? 'array' : typeof value;

    if (actualType !== expectedType) {
      errors.push(
        `Campo '${key}': esperaba ${expectedType}, recibió ${actualType}`
      );
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: data as T };
}

/**
 * Validador de rango numérico
 */
export function validateNumberInRange(
  value: number,
  min: number,
  max: number,
  fieldName: string
): string | null {
  if (value < min || value > max) {
    return `${fieldName} debe estar entre ${min} y ${max}, recibió ${value}`;
  }
  return null;
}
