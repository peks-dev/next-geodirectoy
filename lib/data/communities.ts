import { createClient } from '@/lib/supabase/server';
import type { CommunityFullResponse } from '@/app/types/communityTypes';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';

// ============================================
// 1. OBTENER COMUNIDAD POR ID
// ============================================

export async function getCommunityById(
  id: string
): Promise<CommunityFullResponse | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('get_community_by_id', {
    community_id: id,
  });

  if (error) {
    throw fromSupabaseError(
      error,
      'Comunidad no encontrada',
      ErrorCodes.COMMUNITY_NOT_FOUND
    );
  }

  if (!data || data.length === 0) {
    return null;
  }

  return data[0] as CommunityFullResponse;
}

// ============================================
// 2. OBTENER TODAS LAS COMUNIDADES SIN PAGINACIÓN
// ============================================

/**
 * Obtiene todas las comunidades directamente desde la tabla
 * sin paginación. Útil para mostrar todos los marcadores en el mapa.
 *
 * IMPORTANTE: Esta función trae TODOS los registros.
 * Úsala solo cuando sea necesario (ej: mapa principal).
 */
export async function getAllCommunitiesSimple(
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
