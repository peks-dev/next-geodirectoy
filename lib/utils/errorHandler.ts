import { ZodError } from 'zod';

export interface FieldError {
  field?: string;
  message: string;
}

//  Extrae un mensaje de error legible de cualquier tipo de error

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Ha ocurrido un error inesperado.';
}

// Convierte errores de Zod a un array de mensajes legibles

export function getZodErrorMessages(error: ZodError): FieldError[] {
  return error.issues.map((issue) => ({
    field: issue.path.length > 0 ? issue.path.join('.') : undefined,
    message: issue.message,
  }));
}

// Útil para funciones que necesitan devolver múltiples errores

export function getErrorMessages(error: unknown): FieldError[] {
  if (error instanceof ZodError) {
    return getZodErrorMessages(error);
  }
  return [{ message: getErrorMessage(error) }];
}

// Función auxiliar para obtener solo los mensajes como strings (para compatibilidad)

export function getErrorMessagesAsStrings(error: unknown): string[] {
  return getErrorMessages(error).map((err) =>
    err.field ? `${err.field}: ${err.message}` : err.message
  );
}
