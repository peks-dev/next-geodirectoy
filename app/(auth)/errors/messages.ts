// app/(auth)/errors/messages.ts
import { AuthErrorCodes } from './codes';

interface AuthErrorMessage {
  title: string;
  message: string;
  action?: string;
}

export const AUTH_ERROR_MESSAGES: Record<string, AuthErrorMessage> = {
  [AuthErrorCodes.UNAUTHORIZED]: {
    title: 'No autorizado',
    message: 'No tienes permisos para realizar esta acción.',
    action: 'Iniciar sesión',
  },

  [AuthErrorCodes.INVALID_CREDENTIALS]: {
    title: 'Credenciales inválidas',
    message: 'El email o código proporcionado no es válido.',
    action: 'Verificar datos',
  },

  [AuthErrorCodes.SESSION_EXPIRED]: {
    title: 'Sesión expirada',
    message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
    action: 'Iniciar sesión',
  },

  [AuthErrorCodes.INVALID_TOKEN]: {
    title: 'Token inválido',
    message: 'El token de autenticación no es válido.',
    action: 'Iniciar sesión',
  },

  [AuthErrorCodes.AUTH_CONNECTION_ERROR]: {
    title: 'Error de conexión',
    message:
      'No se pudo conectar con el servidor de autenticación. Por favor verifica tu conexión a internet.',
    action: 'Reintentar',
  },

  [AuthErrorCodes.AUTH_TIMEOUT_ERROR]: {
    title: 'Tiempo de espera agotado',
    message:
      'La solicitud de autenticación tardó demasiado en responder. Por favor intenta de nuevo.',
    action: 'Reintentar',
  },

  [AuthErrorCodes.AUTH_SESSION_EXPIRED]: {
    title: 'Sesión expirada',
    message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
    action: 'Iniciar sesión',
  },

  [AuthErrorCodes.AUTH_SESSION_INVALID]: {
    title: 'Sesión inválida',
    message:
      'Hubo un problema con tu sesión. Por favor inicia sesión nuevamente.',
    action: 'Reiniciar sesión',
  },

  [AuthErrorCodes.AUTH_SESSION_MISSING]: {
    title: 'Sesión no encontrada',
    message: 'No se encontró una sesión activa. Por favor inicia sesión.',
    action: 'Iniciar sesión',
  },

  [AuthErrorCodes.AUTH_CONFIG_ERROR]: {
    title: 'Error de configuración',
    message:
      'Hubo un problema con la configuración de autenticación. Por favor contacta al soporte.',
    action: 'Contactar soporte',
  },

  [AuthErrorCodes.AUTH_PROVIDER_ERROR]: {
    title: 'Error del proveedor',
    message:
      'Hubo un problema con el proveedor de autenticación. Por favor intenta de nuevo.',
    action: 'Reintentar',
  },

  [AuthErrorCodes.AUTH_INVALID_CREDENTIALS]: {
    title: 'Credenciales inválidas',
    message:
      'El email o código proporcionado no es válido. Por favor verifica e intenta de nuevo.',
    action: 'Verificar datos',
  },

  [AuthErrorCodes.AUTH_EMAIL_NOT_VERIFIED]: {
    title: 'Email no verificado',
    message:
      'Tu email no ha sido verificado. Por favor revisa tu bandeja de entrada.',
    action: 'Reenviar código',
  },

  [AuthErrorCodes.AUTH_UNKNOWN_ERROR]: {
    title: 'Error inesperado',
    message:
      'Ocurrió un error inesperado durante la autenticación. Por favor intenta de nuevo.',
    action: 'Reintentar',
  },
};

/**
 * Helper para obtener mensaje de error por código
 */
export function getAuthErrorMessage(code: string): AuthErrorMessage {
  return (
    AUTH_ERROR_MESSAGES[code] ||
    AUTH_ERROR_MESSAGES[AuthErrorCodes.AUTH_UNKNOWN_ERROR]
  );
}
