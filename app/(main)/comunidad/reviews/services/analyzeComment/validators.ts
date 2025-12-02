import type { ValidationResult } from '@/lib/services/ai/core/types';
import { validateSchema } from '@/lib/services/ai/utils/validators';
import type { CommentAnalysisRaw, CommentAnalysisResult } from './types';

/**
 * Validador específico del dominio de comentarios de reviews
 */
export function validateCommentAnalysis(
  data: CommentAnalysisRaw
): ValidationResult<CommentAnalysisResult> {
  // 1. Validar esquema básico
  const schemaValidation = validateSchema<CommentAnalysisRaw>(data, {
    isLegitimate: 'boolean',
  });

  if (!schemaValidation.success) {
    return schemaValidation as ValidationResult<CommentAnalysisResult>;
  }

  const errors: string[] = [];

  // 2. Reglas de negocio específicas
  if (!data.isLegitimate) {
    errors.push(
      'El comentario ha sido rechazado por contener contenido inapropiado.'
    );
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 3. Retornar resultado validado
  return {
    success: true,
    data: {
      isSafe: true,
      success: true,
    },
  };
}
