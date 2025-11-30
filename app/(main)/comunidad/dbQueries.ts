import { createClient } from '@/lib/supabase/server';
import type { CommunityFullResponse } from '@/app/types/communityTypes';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';
import {
  CommunityUpdateData,
  CommunityInsertData,
} from '@/app/types/communityTypes';

/**
 * Data layer puro - Actualiza comunidad en base de datos
 * Throw pattern: Promise<Data> | throw DatabaseError
 */
export async function updateCommunityById(
  dataToUpdate: CommunityUpdateData,
  communityId: string
): Promise<CommunityFullResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('communities')
    .update(dataToUpdate)
    .eq('id', communityId)
    .select()
    .single();

  if (error) {
    throw fromSupabaseError(
      error,
      'Error actualizando comunidad',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as CommunityFullResponse;
}

export async function insertCommunity(
  dataToInsert: CommunityInsertData
): Promise<CommunityFullResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('communities')
    .insert(dataToInsert)
    .select()
    .single();

  if (error) {
    throw fromSupabaseError(
      error,
      'Error insertando comunidad',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as CommunityFullResponse;
}
