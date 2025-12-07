import type { ProfileDbResponse } from './types';

/**
 * Prepara los datos para actualizar el perfil aplicando reglas de negocio
 * @param input - Datos de entrada validados
 * @param currentProfile - Perfil actual
 * @param avatarUrl - Nueva URL del avatar (si existe)
 * @returns Datos preparados para la actualización
 */
export function prepareProfileUpdateData(
  input: { userId: string; name?: string },
  currentProfile: ProfileDbResponse,
  avatarUrl?: string
) {
  const updateData: {
    name: string;
    avatar_url?: string;
    updated_at: string;
    user_id: string;
  } = {
    updated_at: new Date().toISOString(),
    user_id: input.userId,
    name: currentProfile.name,
  };

  // Determina si se debe actualizar el nombre basado en las reglas de negocio
  const shouldUpdateName = (
    newName: string | undefined,
    currentName: string
  ): boolean => {
    return (
      newName !== undefined && newName.length > 0 && newName !== currentName
    );
  };

  // Solo actualizar nombre si fue proporcionado y es diferente
  if (shouldUpdateName(input.name, currentProfile.name)) {
    updateData.name = input.name!;
  }

  // Solo actualizar avatar_url si hay uno nuevo
  if (avatarUrl) {
    updateData.avatar_url = avatarUrl;
  }

  return updateData;
}
