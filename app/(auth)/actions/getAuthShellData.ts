// app/(auth)/actions/getAuthShellData.ts
'use server';

import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { getAuthErrorMessage } from '@/app/(auth)/errors/messages';
import type { User } from '@/lib/supabase/types';

interface AuthShellData {
  initialUser: User | null;
  authError: {
    code: string;
    title: string;
    message: string;
    action?: string;
  } | null;
}

/**
 * Server action que encapsula la lógica de obtención de auth data para SSR
 * Según tu arquitectura: Server action → Database layer
 * Maneja errores específicos del sistema de auth
 */
export async function getAuthShellData(): Promise<AuthShellData> {
  try {
    const initialUser = await getCurrentUser();
    return {
      initialUser,
      authError: null,
    };
  } catch (error) {
    // ✅ Solo capturar errores reales de autenticación, no errores de prerendering
    if (isAuthRelatedError(error)) {
      console.error('Error obteniendo datos de auth en SSR:', error);

      // ✅ Mapeo específico de errores usando el sistema de errores especializado
      const authError = mapToAuthError(error);

      return {
        initialUser: null,
        authError: {
          code: authError.code,
          title: authError.title,
          message: authError.message,
          action: authError.action,
        },
      };
    }

    // ✅ Para errores no relacionados con auth (como prerendering), continuar normalmente
    console.warn('Error no relacionado con auth durante SSR:', error);
    return {
      initialUser: null,
      authError: null,
    };
  }
}

/**
 * Determina si un error está relacionado con autenticación
 */
function isAuthRelatedError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();

  // ✅ Errores relacionados con auth
  const authKeywords = [
    'auth',
    'session',
    'token',
    'credentials',
    'unauthorized',
    'forbidden',
    'supabase',
    'connection',
    'timeout',
  ];

  // ❌ Errores de prerendering de Next.js (no son errores de auth)
  const prerenderingKeywords = [
    'dynamic server usage',
    'rendered statically',
    'cookies',
  ];

  const hasAuthKeyword = authKeywords.some((keyword) =>
    message.includes(keyword)
  );
  const hasPrerenderingKeyword = prerenderingKeywords.some((keyword) =>
    message.includes(keyword)
  );

  return hasAuthKeyword && !hasPrerenderingKeyword;
}

/**
 * Mapea errores específicos del sistema de auth
 */
function mapToAuthError(error: unknown): {
  code: string;
  title: string;
  message: string;
  action?: string;
} {
  // ✅ Si es un error de nuestro sistema de auth, usar el mensaje específico
  if (error instanceof Error && 'code' in error) {
    const authError = error as { code: string };
    const errorMessage = getAuthErrorMessage(authError.code);
    if (errorMessage) {
      return {
        code: authError.code,
        title: errorMessage.title,
        message: errorMessage.message,
        action: errorMessage.action,
      };
    }
  }

  // ✅ Mapeo específico de errores de Supabase
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes('connection') || message.includes('timeout')) {
      const errorMessage = getAuthErrorMessage(
        AuthErrorCodes.AUTH_CONNECTION_ERROR
      );
      return {
        code: AuthErrorCodes.AUTH_CONNECTION_ERROR,
        title: errorMessage.title,
        message: errorMessage.message,
        action: errorMessage.action,
      };
    }

    if (message.includes('session') || message.includes('expired')) {
      const errorMessage = getAuthErrorMessage(
        AuthErrorCodes.AUTH_SESSION_EXPIRED
      );
      return {
        code: AuthErrorCodes.AUTH_SESSION_EXPIRED,
        title: errorMessage.title,
        message: errorMessage.message,
        action: errorMessage.action,
      };
    }

    if (message.includes('invalid') || message.includes('credentials')) {
      const errorMessage = getAuthErrorMessage(
        AuthErrorCodes.AUTH_INVALID_CREDENTIALS
      );
      return {
        code: AuthErrorCodes.AUTH_INVALID_CREDENTIALS,
        title: errorMessage.title,
        message: errorMessage.message,
        action: errorMessage.action,
      };
    }
  }

  // ✅ Error genérico
  const errorMessage = getAuthErrorMessage(AuthErrorCodes.AUTH_UNKNOWN_ERROR);
  return {
    code: AuthErrorCodes.AUTH_UNKNOWN_ERROR,
    title: errorMessage.title,
    message: errorMessage.message,
    action: errorMessage.action,
  };
}
