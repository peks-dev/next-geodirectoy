import { analyzeText } from '@/lib/services/ai/analyzers/textAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import { AIServiceError } from '@/lib/services/ai/errors/custom';
import { COMMENT_ANALYSIS_PROMPT } from './prompts';
import { validateCommentAnalysis } from './validators';
import type {
  CommentAnalysisRaw,
  CommentAnalysisResult,
  CommentAnalysisResponse,
} from './types';

/**
 * Analiza un comentario de usuario para determinar si es seguro publicarlo
 * Usa el servicio global de IA con validación específica del dominio
 *
 * @param commentText - Texto del comentario a analizar
 * @returns Objeto con `isSafe` (booleano) y `success` (booleano)
 */
export async function analyzeUserComment(
  commentText: string
): Promise<CommentAnalysisResponse> {
  try {
    // Llamamos a analyzeText con el parser y validador personalizados
    const result = await analyzeText<CommentAnalysisRaw, CommentAnalysisResult>(
      {
        prompt: COMMENT_ANALYSIS_PROMPT,
        texts: { comment: commentText },
      },
      parseJSONResponse<CommentAnalysisRaw>,
      validateCommentAnalysis
    );

    return result;
  } catch (error) {
    // Manejar errores específicos del servicio de IA
    if (error instanceof AIServiceError) {
      console.error('Error del servicio de IA:', error.message);
    } else {
      console.error('Error inesperado analizando el comentario:', error);
    }

    // Retornar error de forma consistente
    return {
      isSafe: false,
      success: false,
    };
  }
}

export type { CommentAnalysisResponse } from './types';
