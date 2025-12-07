'use server';

import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';
import { ProfileErrorMessages } from '../errors';
import { handleServiceError } from '@/lib/errors/handler';
import { validateOrThrow, ValidationError } from '@/lib/errors/zodHandler';
import { deleteImage } from '@/lib/supabase/storage';
import { DatabaseError } from '@/lib/errors/database';
import {
  updateProfileServerSchema,
  type UpdateProfileActionInput,
} from '../schemas/updateProfileSchema';

import type { ProfileDbResponse } from '../types';

import { insertProfileUpdates } from '../dbQueries';
import { uploadAvatar } from '../services/';
import { extractAvatarPath } from '../utils';
import { prepareProfileUpdateData } from '../transformers';

export interface UpdateProfileData {
  name: string;
  avatar_url: string | null;
  user_id: string;
}

export async function updateProfileController(
  input: UpdateProfileActionInput,
  currentProfile: ProfileDbResponse
): Promise<Result<UpdateProfileData>> {
  let pathToRollback: string | null = null;
  try {
    // 1. Validar input usando validateOrThrow (lanza ValidationError si falla)
    // Esto valida tanto los datos como el archivo comprimido si existe
    const validated = validateOrThrow(updateProfileServerSchema, input);

    // 2. Verificar autenticación
    const user = await getCurrentUser();

    if (!user) {
      return fail(
        AuthErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para editar el perfil'
      );
    }

    // 3. Validar permisos de negocio (lanza ValidationError si falla)
    if (user.id !== validated.userId) {
      throw new ValidationError(
        'No tienes permisos para editar este perfil',
        ErrorCodes.FORBIDDEN,
        'user_id'
      );
    }

    // 4. Variables para tracking de recursos creados (para rollback)
    let avatarUrl: string | null = null;
    let uploadedFilePath: string | null = null;
    let previousAvatarUrl: string | null = null;

    if (currentProfile.avatar_url) {
      previousAvatarUrl = currentProfile.avatar_url;
    }

    // 5. Procesar avatar si existe usando el servicio de negocio
    if (validated.compressedAvatar) {
      const uploatedAvatar = await uploadAvatar(
        validated.compressedAvatar,
        user.id
      );

      uploadedFilePath = uploatedAvatar.uploadedFilePath;
      avatarUrl = uploatedAvatar.avatarUrl;

      // Asignar path para posible rollback
      pathToRollback = uploadedFilePath;
    }

    // 6. Preparar datos de actualización usando validaciones de negocio
    const updateData = prepareProfileUpdateData(
      validated,
      currentProfile,
      avatarUrl || undefined
    );

    // 7. Actualizar perfil en la base de datos
    const profileResponse = await insertProfileUpdates(updateData);

    if (!profileResponse) {
      return fail(
        ErrorCodes.INTERNAL_ERROR,
        ProfileErrorMessages[ErrorCodes.INTERNAL_ERROR]
      );
    }

    // 8. ÉXITO: Eliminar avatar anterior si había uno y se subió uno nuevo
    if (previousAvatarUrl && uploadedFilePath) {
      // Extraer el path del URL anterior
      const previousFilePath = extractAvatarPath(previousAvatarUrl);

      // Eliminar avatar anterior (sin bloquear la respuesta)
      await deleteImage(previousFilePath, 'AVATARS');
    }

    // 9. Devolver resultado exitoso
    return ok({
      name: profileResponse.name,
      avatar_url: profileResponse.avatar_url,
      user_id: profileResponse.user_id,
    });
  } catch (error) {
    // Rollback si error de DB post-upload
    if (pathToRollback && error instanceof DatabaseError) {
      try {
        await deleteImage(pathToRollback, 'AVATARS');
      } catch (rollbackError) {
        console.error('✗ ROLLBACK FALLÓ - Avatar huérfano:', {
          path: pathToRollback,
          originalError: error,
          rollbackError,
        });
      }
    }
    return handleServiceError(error);
  }
}
