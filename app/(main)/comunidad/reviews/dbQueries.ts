import { createClient } from '@/lib/supabase/server';
import type { DbReviewResponse, ReviewToSend } from './types';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';

/**
 * Data layer puro - Obtiene las reseñas de una comunidad
 * Throw pattern: Promise<DbReviewResponse[]> | throw DatabaseError
 */
export async function fetchCommunityReviews(
  communityId: string
): Promise<DbReviewResponse[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      *,
      profiles (
        name,
        avatar_url
      )
    `
    )
    .eq('community_id', communityId)
    .order('created_at', { ascending: false });

  if (error) {
    throw fromSupabaseError(
      error,
      'Error fetching community reviews',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return (data || []) as unknown as DbReviewResponse[];
}

/**
 * Data layer puro - Envía una reseña para una comunidad
 * Throw pattern: Promise<void> | throw DatabaseError
 */
export async function insertCommunityReview(
  review: ReviewToSend
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('reviews').insert(review);

  if (error) {
    throw fromSupabaseError(
      error,
      'Error creating community review',
      ErrorCodes.DATABASE_ERROR
    );
  }
}

/**
 * Data layer puro - Elimina una reseña del usuario
 * Throw pattern: Promise<void> | throw DatabaseError
 */
export async function deleteCommunityReview(
  reviewId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient();

  const { error, count } = await supabase
    .from('reviews')
    .delete()
    .match({ id: reviewId, user_id: userId });

  if (error) {
    throw fromSupabaseError(
      error,
      'Error deleting review',
      ErrorCodes.DATABASE_ERROR
    );
  }

  if (count === 0) {
    throw fromSupabaseError(
      { message: 'Review not found or user not owner' },
      'Reseña no encontrada o no tienes permiso para eliminarla',
      ErrorCodes.NOT_FOUND
    );
  }
}
