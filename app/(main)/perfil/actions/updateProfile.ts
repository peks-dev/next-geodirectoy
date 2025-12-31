'use server';

import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';
import { ErrorCodes as AiErrors } from '@/lib/services/ai/errors/codes';
import { ProfileErrorMessages } from '../errors';
import { handleServiceError } from '@/lib/errors/handler';
import { validateOrThrow, ValidationError } from '@/lib/errors/zodHandler';
import { deleteImage } from '@/lib/supabase/storage';
import { DatabaseError } from '@/lib/errors/database';
import {
  updateProfileServerSchema,
  type UpdateProfileActionInput,
} from '../schemas/updateProfileSchema';

import { insertProfileUpdates, fetchProfileById } from '../dbQueries';
import { uploadAvatar, analyzeProfileImage } from '../services/';
import { extractAvatarPath } from '../utils';
import { prepareProfileUpdateData } from '../transformers';

export interface UpdateProfileData {
  name: string;
  avatar_url: string | null;
  user_id: string;
}

export async function updateProfileController(
  input: UpdateProfileActionInput
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

    // 4. Obtener perfil actual desde la base de datos
    const currentProfile = await fetchProfileById(user.id);

    if (!currentProfile) {
      return fail(ErrorCodes.NOT_FOUND, 'Perfil no encontrado');
    }

    // 5. Variables para tracking de recursos creados (para rollback)
    let avatarUrl: string | null = null;
    let uploadedFilePath: string | null = null;
    let previousAvatarUrl: string | null = null;

    if (currentProfile.avatar_url) {
      previousAvatarUrl = currentProfile.avatar_url;
    }

    // 6. Procesar avatar si existe usando el servicio de negocio
    if (validated.avatar) {
      // Análisis con AI
      const avatarAnalyzed = await analyzeProfileImage({
        image: validated.avatar,
      });

      if (!avatarAnalyzed.isValid) {
        throw new ValidationError(
          'No se permiten imágenes NSFW',
          AiErrors.INAPPROPRIATE_CONTENT
        );
      }

      // Subir a Supabase
      const uploadedAvatar = await uploadAvatar(validated.avatar, user.id);

      uploadedFilePath = uploadedAvatar.uploadedFilePath;
      avatarUrl = uploadedAvatar.avatarUrl;

      // Asignar path para posible rollback
      pathToRollback = uploadedFilePath;
    }

    // 7. Preparar datos de actualización usando validaciones de negocio
    const updateData = prepareProfileUpdateData(
      validated,
      currentProfile,
      avatarUrl || undefined
    );

    // 8. Actualizar perfil en la base de datos
    const profileResponse = await insertProfileUpdates(updateData);

    if (!profileResponse) {
      return fail(
        ErrorCodes.INTERNAL_ERROR,
        ProfileErrorMessages[ErrorCodes.INTERNAL_ERROR]
      );
    }

    // 9. ÉXITO: Eliminar avatar anterior si había uno y se subió uno nuevo
    if (previousAvatarUrl && uploadedFilePath) {
      // Extraer el path del URL anterior
      const previousFilePath = extractAvatarPath(previousAvatarUrl);

      // Eliminar avatar anterior (sin bloquear la respuesta)
      await deleteImage(previousFilePath, 'AVATARS');
    }

    // 10. Devolver resultado exitoso
    return ok({
      name: profileResponse.name,
      avatar_url: profileResponse.avatar_url,
      user_id: profileResponse.user_id,
    });
  } catch (error) {
    // Rollback si error de DB post-upload o post-análisis
    if (pathToRollback && error instanceof DatabaseError) {
      try {
        await deleteImage(pathToRollback, 'AVATARS');
      } catch (rollbackError) {
        // Rollback falló - manejar según necesidades
      }
    }
    return handleServiceError(error);
  }
}
