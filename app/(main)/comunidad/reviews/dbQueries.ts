import { createClient } from '@/lib/supabase/server';
import type { ReviewDatabase, ReviewToSend } from './types';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';

/**
 * Data layer puro - Obtiene las reseñas de una comunidad
 * Throw pattern: Promise<ReviewDatabase[]> | throw DatabaseError
 */
export async function fetchCommunityReviews(
  communityId: string
): Promise<ReviewDatabase[]> {
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

  return (data || []) as unknown as ReviewDatabase[];
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
 * Data layer puro - Obtiene una reseña por ID
 * Throw pattern: Promise<ReviewDatabase | null> | throw DatabaseError
 */
export async function fetchReviewById(
  reviewId: string
): Promise<ReviewDatabase | null> {
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
    .eq('id', reviewId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw fromSupabaseError(
      error,
      'Error fetching review by ID',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return data as unknown as ReviewDatabase | null;
}

/**
 * Data layer puro - Elimina una reseña (sin validaciones)
 * Throw pattern: Promise<void> | throw DatabaseError
 */
export async function deleteReview(reviewId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

  if (error) {
    throw fromSupabaseError(
      error,
      'Error deleting review',
      ErrorCodes.DATABASE_ERROR
    );
  }
}
