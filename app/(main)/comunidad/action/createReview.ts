'use server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { sendCommunityReview } from '@/lib/data/reviews';
import { createClient } from '@/lib/supabase/server';
import { reviewForm } from '../schemas/reviewSchema';
import { analyzeUserComment } from '../utils/analyzeUserComment'; // <-- 1. Importar la función
import type { ReviewFormData, ReviewToSend } from '@/app/types/reviewTypes';
import type { ActionResponse } from '@/app/types/ActionTypes';

export async function createReview(
  review: ReviewFormData
): Promise<ActionResponse<null>> {
  try {
    // 1. Validar los datos de entrada con Zod
    reviewForm.parse(review);

    // 2. Analizar el contenido del comentario con IA
    const analysis = await analyzeUserComment(review.comment);
    if (!analysis.isSafe) {
      // Si el análisis se completó pero el texto no es seguro
      const message = analysis.success
        ? 'Tu comentario ha sido rechazado por nuestro sistema de moderación.'
        : 'No se pudo analizar tu comentario. Inténtalo de nuevo más tarde.';
      return {
        success: false,
        data: null,
        message: message,
      };
    }

    const supabase = await createClient();

    // 3. Verificar la autenticación del usuario
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        data: null,
        message: 'Debes iniciar sesión para dejar una valoración.',
      };
    }

    // 4. Verificar si el usuario ya ha valorado esta comunidad
    const { data: existingReview, error: existingReviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('community_id', review.community_id)
      .single();

    if (existingReview) {
      return {
        success: false,
        data: null,
        message: 'Ya has enviado una valoración para esta comunidad.',
      };
    }

    if (existingReviewError && existingReviewError.code !== 'PGRST116') {
      console.error('Error checking for existing review:', existingReviewError);
      return {
        success: false,
        data: null,
        message: 'No se pudo verificar si ya has valorado esta comunidad.',
      };
    }

    // 5. Preparar y enviar la nueva valoración
    const dataToSend: ReviewToSend = {
      ...review,
      id: uuidv4(),
      user_id: user.id,
    };

    return sendCommunityReview(dataToSend);
  } catch (error) {
    // 6. Manejar errores de validación y otros errores inesperados
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.flatten().fieldErrors);
      return {
        success: false,
        data: null,
        message: 'Los datos proporcionados no son válidos.',
      };
    }

    console.error('Unexpected error creating review:', error);
    return {
      success: false,
      data: null,
      message: 'Ocurrió un error inesperado. Inténtalo de nuevo más tarde.',
    };
  }
}
