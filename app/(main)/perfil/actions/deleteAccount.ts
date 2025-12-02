'use server';
import { createClient } from '@/lib/supabase/server';
import { deleteAccountFromDb } from '@/app/(auth)/services/authService.server';
import { ProfileDbResponse } from '../types/updateProfileTypes';
import { deleteImage } from '@/lib/supabase/storage';

export async function deleteAccount(currentProfile: ProfileDbResponse) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('Debes iniciar sesión para editar el perfil');
    }

    if (user.id !== currentProfile.user_id) {
      throw new Error('no tienes permiso para eliminar este perfil');
    }

    // 2. PRIMERO: Eliminar imágenes del storage (mientras aún tienes sesión válida)
    if (currentProfile.avatar_url) {
      const filePath = currentProfile.avatar_url.split('/avatars/')[1];
      await deleteImage(filePath, 'AVATARS');
    }

    // 3. DESPUÉS: Eliminar cuenta de la base de datos
    const result = await deleteAccountFromDb();
    if (!result.success) {
      throw new Error(result.message);
    }

    return {
      success: true,
      message: 'cuenta eliminada con éxito',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message || 'no se pudo eliminar tu cuenta',
      };
    } else {
      return {
        success: false,
        message: 'no se pudo eliminar tu cuenta',
      };
    }
  }
}
