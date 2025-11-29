import type { ValidationResult } from '@/lib/services/ai/core/types';
import {
  validateSchema,
  validateNumberInRange,
} from '@/lib/services/ai/utils/validators';
import type {
  CommunityTextAnalysisRaw,
  CommunityTextAnalysisResult,
  CourtImageAnalysisRaw,
  CourtImageAnalysisResult,
} from '../types';

import { ImageValidationError, AI_ERROR_MESSAGES } from '@/lib/errors/aiErrors';

/**
 * Validador específico del dominio de comunidades
 */
export function validateCommunityTextAnalysis(
  data: CommunityTextAnalysisRaw
): ValidationResult<CommunityTextAnalysisResult> {
  // 1. Validar esquema básico
  const schemaValidation = validateSchema<CommunityTextAnalysisRaw>(data, {
    isLegitimate: 'boolean',
    spamScore: 'number',
    reasons: 'array',
    confidence: 'number',
  });

  if (!schemaValidation.success) {
    return schemaValidation as ValidationResult<CommunityTextAnalysisResult>;
  }

  const errors: string[] = [];

  // 2. Validar rangos numéricos
  const spamScoreError = validateNumberInRange(
    data.spamScore,
    0,
    1,
    'spamScore'
  );
  if (spamScoreError) errors.push(spamScoreError);

  const confidenceError = validateNumberInRange(
    data.confidence,
    0,
    1,
    'confidence'
  );
  if (confidenceError) errors.push(confidenceError);

  // 3. Reglas de negocio específicas
  if (!data.isLegitimate) {
    errors.push(
      `Texto rechazado: ${data.reasons.length > 0 ? data.reasons.join(', ') : 'contenido sospechoso'}`
    );
  }

  if (data.spamScore > 0.7) {
    errors.push(`Score de spam muy alto: ${Math.round(data.spamScore * 100)}%`);
  }

  if (data.confidence < 0.3 && data.spamScore > 0.5) {
    errors.push('El análisis detectó patrones sospechosos en el texto');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 4. Retornar resultado validado
  return {
    success: true,
    data: {
      isValid: true,
      success: true,
    },
  };
}

/**
 * Validador específico del dominio de canchas
 */
export function validateCourtAnalysis(
  data: CourtImageAnalysisRaw
): ValidationResult<CourtImageAnalysisResult> {
  // 1. Validar esquema básico
  const schemaValidation = validateSchema<CourtImageAnalysisRaw>(data, {
    isBasketballCourt: 'boolean',
    hasPeoplePlaying: 'boolean',
    floorType: 'string',
    isCovered: 'boolean',
    confidence: 'number',
  });

  if (!schemaValidation.success) {
    return schemaValidation as ValidationResult<CourtImageAnalysisResult>;
  }

  const errors: string[] = [];

  // 2. Validar rango de confidence
  const confidenceError = validateNumberInRange(
    data.confidence,
    0,
    1,
    'confidence'
  );
  if (confidenceError) {
    errors.push(confidenceError);
  }

  // 3. Reglas de negocio del dominio
  if (!data.isBasketballCourt) {
    throw new ImageValidationError(
      AI_ERROR_MESSAGES.NOT_BASKETBALL_COURT,
      'basketball'
    );
  }

  if (!data.hasPeoplePlaying) {
    throw new ImageValidationError(
      AI_ERROR_MESSAGES.NO_PEOPLE_PLAYING,
      'people'
    );
  }

  // 4. Validar campos obligatorios después de pasar las reglas
  if (!data.floorType) {
    errors.push('El tipo de suelo no pudo ser determinado');
  }

  if (data.isCovered === null) {
    errors.push('No se pudo determinar si la cancha está techada');
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // 5. Retornar datos validados
  return {
    success: true,
    data: {
      floorType: data.floorType!,
      isCovered: data.isCovered!,
      success: true,
    },
  };
}
