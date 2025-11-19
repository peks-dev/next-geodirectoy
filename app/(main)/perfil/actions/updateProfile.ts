'use server';

import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '@/app/(auth)/services/authService.server';
import {
  updateProfileServerSchema,
  type UpdateProfileActionInput,
} from '../schemas/updateProfileSchema';

import type {
  ProfileDbResponse,
  UpdateProfileResult,
} from '../types/updateProfileTypes';

import { base64ToBuffer } from '@/lib/utils/images/imagesTransform';

import { updateProfileDb } from '../services/profileRepository';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';

export async function updateProfile(
  input: UpdateProfileActionInput,
  currentProfile: ProfileDbResponse
): Promise<UpdateProfileResult> {
  try {
    // 1. Validar input (CRÍTICO: nunca confiar en datos del cliente)
    const validated = updateProfileServerSchema.parse(input);

    // 2. Verificar autenticación
    const { data: user, error: authError } = await getCurrentUser();

    if (authError || !user) {
      throw new Error('Debes iniciar sesión para editar el perfil');
    }

    // 3. Verificar autorización (el userId debe coincidir con el usuario autenticado)
    if (user.id !== validated.userId) {
      throw new Error('No tienes permisos para editar este perfil');
    }

    // 4. Variables para tracking de recursos creados (para rollback)
    let avatarUrl: string | null = null;
    let uploadedFilePath: string | null = null;
    let previousAvatarUrl: string | null = null;

    if (currentProfile.avatar_url) {
      previousAvatarUrl = currentProfile.avatar_url;
    }

    // 5. Procesar avatar si existe
    if (validated.compressedAvatar) {
      const { data: base64Data, name, type } = validated.compressedAvatar;

      try {
        // Convertir base64 a Buffer
        const buffer = base64ToBuffer(base64Data);

        // Generar nombre único para el archivo
        const extension = type.split('/')[1]; // 'jpeg', 'png', 'webp'
        const fileName = `${uuidv4()}.${extension}`;
        const filePath = `${user.id}/${fileName}`;

        // Crear File object desde el buffer
        const file = new File([buffer], name, { type });

        // Subir usando la función de storage
        const uploadResult = await uploadImage(file, 'AVATARS', filePath);

        if (!uploadResult.success) {
          throw new Error(
            uploadResult.error || 'Error al subir la imagen. Intenta de nuevo.'
          );
        }

        uploadedFilePath = uploadResult.path!;
        avatarUrl = uploadResult.url!;
      } catch (uploadError) {
        throw new Error(
          uploadError instanceof Error
            ? uploadError.message
            : 'Error al procesar la imagen'
        );
      }
    }

    // 6. Actualizar perfil en la base de datos
    const updateData: {
      name: string;
      avatar_url?: string;
      updated_at: string;
      user_id: string;
    } = {
      updated_at: new Date().toISOString(),
      user_id: validated.userId,
      name: currentProfile.name,
    };

    // Solo actualizar nombre si fue proporcionado
    if (validated.name && validated.name.length > 0) {
      updateData.name = validated.name;
    }

    // Solo actualizar avatar_url si hay uno nuevo
    if (avatarUrl) {
      updateData.avatar_url = avatarUrl;
    }

    // Llamar a la accion de servidor
    const profileResponse = await updateProfileDb(updateData);

    if (!profileResponse.data) {
      // Rollback: eliminar avatar recién subido
      if (uploadedFilePath) {
        await deleteImage(uploadedFilePath, 'AVATARS').catch(console.error);
      }
      throw new Error('Error al actualizar el perfil en la base de datos');
    }

    // 7. ÉXITO: Eliminar avatar anterior si había uno y se subió uno nuevo
    if (previousAvatarUrl && uploadedFilePath) {
      // Extraer el path del URL anterior
      const previousFilePath = previousAvatarUrl.split('/avatars/')[1];

      // Eliminar avatar anterior (sin bloquear la respuesta)
      deleteImage(previousFilePath, 'AVATARS').catch((error) => {
        console.error('No se pudo eliminar el avatar antiguo:', error);
      });
    }

    // 8. Devolver resultado exitoso
    return {
      success: true,
      data: {
        name: profileResponse.data.name,
        avatar_url: profileResponse.data.avatar_url,
        user_id: profileResponse.data.user_id,
      },
      message: 'Perfil actualizado correctamente',
    };
  } catch (error) {
    // Manejar errores de validación de Zod
    if (error && typeof error === 'object' && 'errors' in error) {
      const zodError = error as { errors: Array<{ message: string }> };
      return {
        success: false,
        data: null,
        message: zodError.errors[0]?.message || 'Datos inválidos',
      };
    }
    if (error instanceof Error) {
      return {
        success: false,
        data: null,
        message: error.message || 'algo salio mal',
      };
    }

    return {
      success: false,
      data: null,
      message: 'Error inesperado. Intenta de nuevo.',
    };
  }
}
