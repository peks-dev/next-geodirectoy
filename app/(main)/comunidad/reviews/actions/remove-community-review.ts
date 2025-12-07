'use server';

import { fetchReviewById } from '../dbQueries';
import { deleteUserReview } from '../services';
import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';

export async function removeCommunityReview(
  reviewId: string
): Promise<Result<null>> {
  try {
    // 1. Comprobar que hay un usuario loggeado
    const user = await getCurrentUser();

    if (!user) {
      return fail(
        AuthErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para eliminar una valoración.'
      );
    }

    // 2. Obtener la reseña para validar ownership
    const review = await fetchReviewById(reviewId);

    if (!review) {
      return fail(ErrorCodes.NOT_FOUND, 'Reseña no encontrada.');
    }

    // 3. Llamar al servicio para eliminar (el servicio verifica ownership)
    await deleteUserReview(review, user.id);

    return ok(null);
  } catch (error) {
    return handleServiceError(error);
  }
}
