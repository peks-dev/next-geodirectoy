'use server';

import { v4 as uuidv4 } from 'uuid';
import { insertCommunityReview } from '../dbQueries';
import { createClient } from '@/lib/supabase/server';
import { reviewForm } from '../schemas/reviewSchema';
import { analyzeUserComment } from '../services/analyzeComment';
import type { ReviewFormData, ReviewToSend } from '../types';
import { type Result, ok, fail } from '@/lib/types/result';
import { ErrorCodes } from '@/lib/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';
import { validateOrThrow } from '@/lib/errors/zodHandler';

export async function createCommunityReview(
  review: ReviewFormData
): Promise<Result<null>> {
  try {
    // 1. Validar los datos de entrada con Zod
    validateOrThrow(reviewForm, review);

    // 2. Analizar el contenido del comentario con IA
    const analysis = await analyzeUserComment(review.comment);
    if (!analysis.isSafe) {
      // Si el análisis se completó pero el texto no es seguro
      const message = analysis.success
        ? 'Tu comentario ha sido rechazado por nuestro sistema de moderación.'
        : 'No se pudo analizar tu comentario. Inténtalo de nuevo más tarde.';
      return fail(ErrorCodes.BUSINESS_RULE_VIOLATION, message);
    }

    const supabase = await createClient();

    // 3. Verificar la autenticación del usuario
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail(
        ErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para dejar una valoración.'
      );
    }

    // 4. Verificar si el usuario ya ha valorado esta comunidad
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('community_id', review.community_id)
      .single();

    if (existingReview) {
      return fail(
        ErrorCodes.REVIEW_ALREADY_EXISTS,
        'Ya has enviado una valoración para esta comunidad.'
      );
    }

    if (existingReviewError && existingReviewError.code !== 'PGRST116') {
      console.error('Error checking for existing review:', existingReviewError);
      return fail(
        ErrorCodes.DATABASE_ERROR,
        'No se pudo verificar si ya has valorado esta comunidad.'
      );
    }

    // 5. Preparar y enviar la nueva valoración
    const dataToSend: ReviewToSend = {
      ...review,
      id: uuidv4(),
      user_id: user.id,
    };

    await insertCommunityReview(dataToSend);

    return ok(null);
  } catch (error) {
    return handleServiceError(error);
  }
}
