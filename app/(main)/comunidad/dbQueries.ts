import { createClient } from '@/lib/supabase/server';
import type { CommunityFullResponse, Community } from '@/comunidad/types';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';
import { CommunityUpdateData, CommunityInsertData } from '@/comunidad/types';

/**
 * Obtiene todas las comunidades directamente desde la tabla
 * sin paginación. Útil para mostrar todos los marcadores en el mapa.
 *
 * IMPORTANTE: Esta función trae TODOS los registros.
 * Úsala solo cuando sea necesario (ej: mapa principal).
 */
export async function fetchAllCommunitiesForMap(
  maxResults: number | null = null
): Promise<CommunityFullResponse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_all_communities', {
    max_results: maxResults,
  });

  if (error) {
    throw fromSupabaseError(
      error,
      'Error al obtener comunidades',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return (data || []) as CommunityFullResponse[];
}

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

/**
 * Data layer puro - Obtiene comunidad por ID
 * Throw pattern: Promise<CommunityFullResponse> | throw DatabaseError
 */
export async function getCommunityById(
  communityId: string
): Promise<CommunityFullResponse> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('id', communityId)
    .single();

  if (error) {
    throw fromSupabaseError(
      error,
      'Error obteniendo comunidad por ID',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as CommunityFullResponse;
}

/**
 * Data layer puro - Elimina comunidad por ID
 * Throw pattern: Promise<void> | throw DatabaseError
 */
export async function deleteCommunityById(communityId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('communities')
    .delete()
    .eq('id', communityId);

  if (error) {
    throw fromSupabaseError(
      error,
      'Error eliminando comunidad',
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * Data layer puro - Obtiene comunidades por usuario
 * Throw pattern: Promise<Community[]> | throw DatabaseError
 */
export async function getCommunitiesByUserId(
  userId: string
): Promise<Community[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('communities')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    throw fromSupabaseError(
      error,
      'Error obteniendo comunidades del usuario',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return (data || []) as Community[];
}
