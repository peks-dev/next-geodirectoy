import { ImageValidationError, AI_ERROR_MESSAGES } from '@/lib/ai/aiErrors';
import type {
  ImageAnalysisResult,
  ValidationResult,
  TextAnalysisResult,
  TextValidationResult,
} from './types';

export function validateCourtAnalysis(
  analysis: ImageAnalysisResult
): ValidationResult {
  // Validación 1: Debe ser una cancha de baloncesto
  if (!analysis.isBasketballCourt) {
    throw new ImageValidationError(
      AI_ERROR_MESSAGES.NOT_BASKETBALL_COURT,
      'basketball'
    );
  }

  // Validación 2: Debe haber personas jugando
  if (!analysis.hasPeoplePlaying) {
    throw new ImageValidationError(
      AI_ERROR_MESSAGES.NO_PEOPLE_PLAYING,
      'people'
    );
  }

  return {
    success: true,
    errors: [],
    data: analysis,
  };
}

export function validateTextAnalysis(
  analysis: TextAnalysisResult
): TextValidationResult {
  const errors: string[] = [];

  // Validación 1: Si la IA detecta que es spam/trolleo
  if (!analysis.isLegitimate) {
    errors.push(
      `El texto parece ser spam o contenido malicioso: ${analysis.reasons.join(', ')}`
    );
  }

  // Validación 2: Si el score de spam es muy alto (> 0.7)
  if (analysis.spamScore > 0.7) {
    errors.push(
      `El texto tiene un alto score de spam (${Math.round(analysis.spamScore * 100)}%)`
    );
  }

  // Validación 3: Si la confianza es muy baja, podría ser sospechoso
  if (analysis.confidence < 0.3 && analysis.spamScore > 0.5) {
    errors.push('El análisis muestra patrones sospechosos en el texto');
  }

  // Si hay errores, no es válido
  if (errors.length > 0) {
    return {
      success: false,
      errors,
      data: analysis,
    };
  }

  // Si pasa todas las validaciones
  return {
    success: true,
    errors: [],
    data: analysis,
  };
}
