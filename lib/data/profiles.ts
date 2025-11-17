import { success } from 'zod';
import { createClient } from '../supabase/server';

import type {
  ProfileDbResponse,
  ProfileDataToInsert,
} from '@/app/(main)/perfil/types/updateProfileTypes';

export async function fetchProfileData(
  userId: string
): Promise<ProfileDbResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', userId)
      .single();
    if (error) {
      console.log(error);
      throw new Error('no se pudo traer los datos de supabase');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateProfileDb(
  dataToInsert: ProfileDataToInsert
): Promise<ProfileDbResponse> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .update(dataToInsert)
      .eq('user_id', dataToInsert.user_id)
      .select();

    if (error) {
      throw error;
    }
    console.log('supabase:', data);
    return data[0];
  } catch (error) {
    throw new Error('no se pudieron insertar los datos en supabase');
  }
}

// Función para eliminar la cuenta del usuario
export async function deleteAccountFromDb() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('delete_user_account');

    // Primero verificar errores de conexión
    if (error) throw error;

    // Luego verificar la respuesta de la función RPC
    if (!data || !data.success) {
      throw new Error(data?.message || 'No se pudo eliminar la cuenta');
    }

    return {
      success: true,
      message: data.message || 'cuenta eliminada',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: 'no se pudo eliminar la cuenta de supabase',
      };
    }
  }
}
