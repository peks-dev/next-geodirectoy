'use server';
import { createClient } from '@/lib/supabase/server';

import {
  ProfileDataToInsert,
  ProfileDbResponse,
} from '@/app/(main)/perfil/types/updateProfileTypes';

interface ReturnProps {
  data: ProfileDbResponse | null;
  error: string | null;
}

export async function fetchCurrentUserProfile() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('Usuario no autenticado');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) throw profileError;

    return { data: profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error al obtener perfil',
    };
  }
}

/**
 * Obtiene el perfil de un usuario específico por su ID
 * @param userId - ID del usuario
 * @returns Datos del perfil o null
 */
export async function fetchProfileById(userId: string): Promise<ReturnProps> {
  try {
    const supabase = await createClient();

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    return { data: profile, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error al obtener perfil',
    };
  }
}

/**
 * Actualiza el perfil del usuario autenticado
 * @param updates - Objeto con los campos a actualizar
 * @returns Perfil actualizado o error
 */
export async function updateProfileDb(dataToInsert: ProfileDataToInsert) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('profiles')
      .update(dataToInsert)
      .eq('user_id', dataToInsert.user_id)
      .select()
      .single(); // .single() si esperas un solo resultado

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'No se pudo actualizar el perfil',
    };
  }
}
