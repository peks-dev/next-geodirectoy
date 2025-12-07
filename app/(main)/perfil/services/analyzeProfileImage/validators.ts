import type { ValidationResult } from '@/lib/services/ai/core/types';
import {
  validateSchema,
  validateNumberInRange,
} from '@/lib/services/ai/utils/validators';
import type {
  ProfileImageAnalysisRaw,
  ProfileImageAnalysisResult,
} from './types';

import { ImageValidationError } from '@/lib/services/ai/errors/custom';

/**
 * Validador específico para análisis de imágenes de perfil
 */
export function validateProfileImageAnalysis(
  data: ProfileImageAnalysisRaw
): ValidationResult<ProfileImageAnalysisResult> {
  // 1. Validar esquema básico
  const schemaValidation = validateSchema<ProfileImageAnalysisRaw>(data, {
    isAppropriate: 'boolean',
    confidence: 'number',
  });

  if (!schemaValidation.success) {
    return schemaValidation as ValidationResult<ProfileImageAnalysisResult>;
  }

  const errors: string[] = [];

  // 2. Validar rangos numéricos
  const confidenceError = validateNumberInRange(
    data.confidence,
    0,
    100,
    'confidence'
  );
  if (confidenceError) errors.push(confidenceError);

  // 3. Reglas de negocio específicas para perfiles
  if (!data.isAppropriate) {
    throw new ImageValidationError(
      'La imagen contiene contenido inapropiado (NSFW, gore, violencia u otro contenido no permitido)',
      'basketball' // Reutilizando el tipo existente
    );
  }

  if (data.confidence < 70) {
    errors.push(
      `Confianza insuficiente en el análisis: ${data.confidence}% (mínimo 70%)`
    );
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 4. Retornar resultado validado
  return {
    success: true,
    data: {
      isValid: true,
      confidence: data.confidence,
      success: true,
    },
  };
}
