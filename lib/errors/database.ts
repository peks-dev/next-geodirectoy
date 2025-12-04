// lib/errors/database.ts
import { ErrorCodes } from './codes';

/**
 * Error para todas las operaciones de base de datos
 * Incluye operaciones con Supabase (PostgreSQL, RPC, etc.)
 */
export class DatabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
    public field?: string
  ) {
    super(message);
    this.name = 'DatabaseError';
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

/**
 * Helper específico para errores de Supabase
 * Convierte el error de Supabase a DatabaseError
 */
export function fromSupabaseError(
  error: { message: string; code?: string; details?: string },
  userMessage: string,
  errorCode: string
): DatabaseError {
  return new DatabaseError(userMessage, errorCode, {
    supabaseMessage: error.message,
    supabaseCode: error.code,
    supabaseDetails: error.details,
  });
}
