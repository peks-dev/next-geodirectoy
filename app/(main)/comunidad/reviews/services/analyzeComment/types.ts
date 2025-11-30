/**
 * Tipos para el servicio de análisis de comentarios con IA
 */

/**
 * Respuesta cruda de la IA para análisis de comentario
 */
export interface CommentAnalysisRaw {
  isLegitimate: boolean;
}

/**
 * Resultado validado para el dominio de reviews
 */
export interface CommentAnalysisResult {
  isSafe: boolean;
  success: true;
}

/**
 * Resultado de error del servicio
 */
export interface CommentAnalysisError {
  isSafe: false;
  success: false;
}

/**
 * Respuesta completa del análisis de comentario
 */
export type CommentAnalysisResponse =
  | CommentAnalysisResult
  | CommentAnalysisError;
