import { analyzeText } from '@/lib/services/ai/analyzers/textAnalyzer';
import { parseJSONResponse } from '@/lib/services/ai/utils/parsers';
import { AIServiceError } from '@/lib/services/ai/errors/custom';
import { ErrorCodes } from '@/lib/services/ai/errors/codes';
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
 * @returns Objeto con `isSafe` (booleano) y `success` (booleano) si es exitoso, lanza error si falla
 */
export async function analyzeUserComment(
  commentText: string
): Promise<CommentAnalysisResponse> {
  // Llamamos a analyzeText con el parser y validador personalizados
  const result = await analyzeText<CommentAnalysisRaw, CommentAnalysisResult>(
    {
      prompt: COMMENT_ANALYSIS_PROMPT,
      texts: { comment: commentText },
    },
    parseJSONResponse<CommentAnalysisRaw>,
    validateCommentAnalysis
  );

  if (!result.isSafe) {
    throw new AIServiceError(
      ErrorCodes.INAPPROPRIATE_CONTENT,
      'Tu reseña tiene contenido inapropiado'
    );
  }

  return result;
}
