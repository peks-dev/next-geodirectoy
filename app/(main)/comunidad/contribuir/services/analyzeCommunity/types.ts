import type { FloorType } from '@/app/types/communityTypes';

// ============================================
// AI ANALYSIS
// ============================================

/**
 * Respuesta cruda de la IA para análisis de texto de comunidad
 */
export interface CommunityTextAnalysisRaw {
  isLegitimate: boolean;
  spamScore: number;
  reasons: string[];
  confidence: number;
}
export interface CommunityTexts extends Record<string, string> {
  name: string;
  description: string;
}
/**
 * Resultado validado para el dominio
 */
export interface CommunityTextAnalysisResult {
  isValid: boolean;
  success: true;
}

/**
 * Respuesta cruda de la IA para análisis de canchas
 */
export interface CourtImageAnalysisRaw {
  isBasketballCourt: boolean;
  hasPeoplePlaying: boolean;
  floorType: FloorType | null;
  isCovered: boolean | null;
  confidence: number;
}

/**
 * Resultado validado para el dominio
 */
export interface CourtImageAnalysisResult {
  floorType: FloorType;
  isCovered: boolean;
  success: true;
}
