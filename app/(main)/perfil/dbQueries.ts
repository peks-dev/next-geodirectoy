import { createClient } from '@/lib/supabase/server';
import type { ProfileDbResponse, ProfileDataToInsert } from './types';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';

/**
 * Data layer puro - Obtiene el perfil de un usuario específico por su ID
 * Throw pattern: Promise<ProfileDbResponse | null> | throw DatabaseError
 */
export async function fetchProfileById(
  userId: string
): Promise<ProfileDbResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw fromSupabaseError(
      error,
      'Error fetching profile by ID',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as ProfileDbResponse | null;
}

/**
 * Data layer puro - Actualiza el perfil de un usuario
 * Throw pattern: Promise<ProfileDbResponse> | throw DatabaseError
 */
export async function insertProfileUpdates(
  dataToInsert: ProfileDataToInsert
): Promise<ProfileDbResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .update(dataToInsert)
    .eq('user_id', dataToInsert.user_id)
    .select()
    .single();

  if (error) {
    throw fromSupabaseError(
      error,
      'Error updating profile',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as ProfileDbResponse;
}

/**
 * Data layer puro - Obtiene el perfil del usuario autenticado
 * Throw pattern: Promise<ProfileDbResponse> | throw DatabaseError
 */
export async function fetchCurrentUserProfile(
  userId: string
): Promise<ProfileDbResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw fromSupabaseError(
      error,
      'Error fetching current user profile',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as ProfileDbResponse;
}
