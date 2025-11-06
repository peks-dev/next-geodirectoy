'use server';
import type { ActionResponse } from '@/app/types/ActionTypes';
import { deleteUserReview } from '@/lib/data/reviews';
import { createClient } from '@/lib/supabase/server';

export async function deleteReview(
  reviewId: string
): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient();

    // 1. Comprobar que hay un usuario loggeado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        data: null,
        message: 'Debes iniciar sesión para eliminar una valoración.',
      };
    }

    // 2. Llamar a la función de base de datos para eliminar la review
    // La verificación de que el usuario es el creador ocurre en deleteUserReview
    return await deleteUserReview(reviewId, user.id);
  } catch (error) {
    console.error('Error inesperado al eliminar review:', error);
    return {
      success: false,
      data: null,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    };
  }
}
