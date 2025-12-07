import { ErrorCodes } from '@/lib/errors/codes';

/**
 * Mensajes de error específicos del dominio 'perfil'
 * Estos mensajes están optimizados para la experiencia del usuario
 * Usan códigos genéricos de ErrorCodes para consistencia
 */
export const ProfileErrorMessages = {
  [ErrorCodes.NOT_FOUND]: 'No se encontró el perfil solicitado.',
  [ErrorCodes.INTERNAL_ERROR]:
    'No se pudo actualizar el perfil. Intenta de nuevo.',
  [ErrorCodes.STORAGE_ERROR]: 'Error al procesar la imagen del avatar.',

  [ErrorCodes.VALIDATION_ERROR]: 'El nombre del perfil no es válido.',
  [ErrorCodes.FORBIDDEN]: 'No tienes permisos para editar este perfil.',
} as const;
