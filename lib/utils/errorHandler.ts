import { ZodError, ZodIssue } from 'zod';

export interface FieldError {
  field?: string;
  message: string;
}

/**
 * Extracts error messages from various error types
 */
export function getErrorMessages(error: unknown): FieldError[] {
  if (error instanceof ZodError) {
    return error.issues.map((err: ZodIssue) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }

  if (error instanceof Error) {
    return [{ message: error.message }];
  }

  if (typeof error === 'string') {
    return [{ message: error }];
  }

  return [{ message: 'Ha ocurrido un error inesperado' }];
}

/**
 * Gets a single error message from an error
 */
export function getErrorMessage(error: unknown): string {
  const errors = getErrorMessages(error);
  return errors.length > 0
    ? errors[0].message
    : 'Ha ocurrido un error inesperado';
}
