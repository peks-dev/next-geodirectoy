'use server';

import { deleteReview } from '../dbQueries';
import { type Result, ok, fail } from '@/lib/types/result';
import { ErrorCodes } from '@/lib/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';
import type { ReviewDatabase } from '../types';

/**
 * Service layer - Elimina una reseña del usuario actual
 * Verifica ownership antes de eliminar
 * Throw pattern: Promise<Result<null>> | throw ServiceError
 */
export async function deleteUserReview(
  review: ReviewDatabase,
  userId: string
): Promise<Result<null>> {
  try {
    // 1. Verificar que la reseña pertenece al usuario
    if (review.user_id !== userId) {
      return fail(
        ErrorCodes.FORBIDDEN,
        'No tienes permiso para eliminar esta valoración.'
      );
    }

    // 2. Llamar a la capa de datos para eliminar
    await deleteReview(review.id);

    return ok(null);
  } catch (error) {
    return handleServiceError(error);
  }
}
