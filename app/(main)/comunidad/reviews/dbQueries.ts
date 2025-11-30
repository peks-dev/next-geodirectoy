import { createClient } from '@/lib/supabase/server';
import type { DbReviewResponse, ReviewToSend } from './types';
import type { ActionResponse } from '@/app/types/ActionTypes';

export async function getCommunityReviews(
  communityId: string
): Promise<ActionResponse<DbReviewResponse[]>> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      id,
      rating,
      comment,
      created_at,
      updated_at,
      user_id,
      community_id,
      profiles!user_id (
        name,
        avatar_url
      )
    `
    )
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching community reviews:', error);
    return {
      success: false,
      data: null,
      message: 'No se pudieron cargar los comentarios.',
    };
  }

  const reviews = (data || []) as unknown as DbReviewResponse[];
  return {
    success: true,
    data: reviews,
    message: null,
  };
}

export async function sendCommunityReview(
  review: ReviewToSend
): Promise<ActionResponse<null>> {
  const supabase = await createClient();

  const { error } = await supabase.from('reviews').insert(review);

  if (error) {
    console.error('Error sending review:', error);
    return {
      success: false,
      data: null,
      message: 'No se pudo enviar tu valoración. Intenta de nuevo.',
    };
  }

  return {
    success: true,
    data: null,
    message: '¡Gracias por tu aportación!',
  };
}

// Agrega esta función al final del archivo geodirectory/lib/data/reviews.ts

export async function deleteUserReview(
  reviewId: string,
  userId: string
): Promise<ActionResponse<null>> {
  const supabase = await createClient();

  const { error, count } = await supabase
    .from('reviews')
    .delete()
    .match({ id: reviewId, user_id: userId }); // <-- ¡Importante!

  if (error) {
    console.error('Error deleting review:', error);
    return {
      success: false,
      data: null,
      message: 'No se pudo eliminar tu valoración. Intenta de nuevo.',
    };
  }

  if (count === 0) {
    // Esto puede pasar si la review ya fue borrada o si el usuario no es el propietario
    return {
      success: false,
      data: null,
      message:
        'No se encontró la valoración o no tienes permiso para eliminarla.',
    };
  }

  return {
    success: true,
    data: null,
    message: 'Tu valoración ha sido eliminada con éxito.',
  };
}
