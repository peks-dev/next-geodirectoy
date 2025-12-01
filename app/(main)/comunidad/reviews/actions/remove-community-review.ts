'use server';

import { deleteCommunityReview } from '../dbQueries';
import { createClient } from '@/lib/supabase/server';
import { type Result, ok, fail } from '@/lib/types/result';
import { ErrorCodes } from '@/lib/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';

export async function removeCommunityReview(
  reviewId: string
): Promise<Result<null>> {
  try {
    const supabase = await createClient();

    // 1. Comprobar que hay un usuario loggeado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail(
        ErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para eliminar una valoración.'
      );
    }

    // 2. Llamar a la función de base de datos para eliminar la review
    // La verificación de que el usuario es el creador ocurre en deleteCommunityReview
    await deleteCommunityReview(reviewId, user.id);

    return ok(null);
  } catch (error) {
    return handleServiceError(error);
  }
}
