import type { FloorType } from '@/app/types/communityTypes';

interface CourtProperties {
  floorType: FloorType;
  isCovered: boolean;
}

interface SuccessAnalysis {
  success: boolean;
}

// === TIPOS PARA ANÁLISIS DE IMAGENES ===
export interface ImageAnalysisResult extends CourtProperties {
  isBasketballCourt: boolean;
  hasPeoplePlaying: boolean;
  confidence: number; // 0-1, qué tan segura está la IA
}

// Resultado de la validación (incluye errores si los hay)
export interface ValidationResult extends SuccessAnalysis {
  errors: string[];
  data?: ImageAnalysisResult;
}

export interface CourtImageAnalysisResult
  extends CourtProperties,
    SuccessAnalysis {}

// === TIPOS PARA ANÁLISIS DE TEXTO ===

export interface TextAnalysisResult {
  isLegitimate: boolean; // true si el texto es legítimo, false si es trolleo/spam
  spamScore: number; // 0-1, donde 1 es muy probable que sea spam
  reasons: string[]; // Lista de razones por las que podría ser spam
  confidence: number; // 0-1, qué tan segura está la IA
}

export interface TextValidationResult extends SuccessAnalysis {
  errors: string[];
  data?: TextAnalysisResult;
}

export interface CommunityTextAnalysisResult extends SuccessAnalysis {
  isValid: boolean; // true si el texto pasa la validación
}
