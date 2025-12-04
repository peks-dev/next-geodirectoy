// app/(auth)/errors/custom.ts
import { AuthErrorCodes, type AuthErrorCode } from './codes';

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public details?: unknown,
    public field?: string
  ) {
    super(message);
    this.name = 'AuthError';
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class AuthConnectionError extends AuthError {
  constructor(message: string, details?: unknown) {
    super(AuthErrorCodes.AUTH_CONNECTION_ERROR, message, details);
    this.name = 'AuthConnectionError';
  }
}

export class AuthSessionError extends AuthError {
  constructor(message: string, details?: unknown) {
    super(AuthErrorCodes.AUTH_SESSION_EXPIRED, message, details);
    this.name = 'AuthSessionError';
  }
}

export class AuthValidationError extends AuthError {
  constructor(message: string, field?: string, details?: unknown) {
    super(AuthErrorCodes.AUTH_INVALID_CREDENTIALS, message, details, field);
    this.name = 'AuthValidationError';
  }
}

/**
 * Helper para crear errores de autenticación desde errores de Supabase
 */
export function fromSupabaseAuthError(
  error: { message: string; code?: string; details?: string },
  userMessage: string,
  errorCode: AuthErrorCode
): AuthError {
  return new AuthError(errorCode, userMessage, {
    supabaseMessage: error.message,
    supabaseCode: error.code,
    supabaseDetails: error.details,
  });
}
