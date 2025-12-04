'use server';

import { v4 as uuidv4 } from 'uuid';
import { insertCommunityReview } from '../dbQueries';
import { createClient } from '@/lib/supabase/server';
import { reviewForm } from '../schemas/reviewSchema';
import { analyzeUserComment, checkExistingReview } from '../services/';
import type { ReviewFormData, ReviewToSend } from '../types';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';
import { validateOrThrow } from '@/lib/errors/zodHandler';

export async function createCommunityReview(
  review: ReviewFormData
): Promise<Result<null>> {
  try {
    const supabase = await createClient();

    // 1. Verificar la autenticación del usuario
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail(
        AuthErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para dejar una valoración.'
      );
    }

    // 2. Validar los datos de entrada con Zod
    validateOrThrow(reviewForm, review);

    // 3. Verificar si el usuario ya ha valorado esta comunidad
    await checkExistingReview(user.id, review.community_id);

    // 4. Analizar el contenido del comentario con IA
    await analyzeUserComment(review.comment);

    // 5. Preparar y enviar la nueva valoración
    const dataToSend: ReviewToSend = {
      ...review,
      id: uuidv4(),
      user_id: user.id,
    };

    // 6. Mandar a supabase
    await insertCommunityReview(dataToSend);

    return ok(null);
  } catch (error) {
    return handleServiceError(error);
  }
}
