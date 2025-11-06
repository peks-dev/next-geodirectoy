import { analyzeText } from '@/lib/utils/textAnalizer';
import { COMMENT_ANALYSIS_PROMPT } from '../prompts';
import { parseSimpleTextAnalysisResponse } from '@/lib/ai/parsers'; // <-- 1. Usar el nuevo parser

// Definimos la "forma" del objeto que esperamos recibir de la validación.
interface TextAnalysisData {
  isLegitimate: boolean;
}

// 2. Definimos un tipo de resultado de validación para mayor claridad.
type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

// 3. Creamos un validador simple y específico para esta tarea.
function validateCommentAnalysis(
  parsedData: unknown
): ValidationResult<TextAnalysisData> {
  // Comprobamos si el dato es un objeto y tiene la propiedad 'isLegitimate' de tipo booleano.
  if (
    typeof parsedData === 'object' &&
    parsedData !== null &&
    'isLegitimate' in parsedData &&
    typeof (parsedData as Record<string, unknown>).isLegitimate === 'boolean'
  ) {
    return {
      success: true,
      data: parsedData as TextAnalysisData,
    };
  }
  return {
    success: false,
    errors: [
      'La respuesta de la IA no tiene el formato esperado ({ isLegitimate: boolean }).',
    ],
  };
}

export async function analyzeUserComment(commentText: string) {
  const prompt = COMMENT_ANALYSIS_PROMPT.replace('{comment}', commentText);

  try {
    // 4. Llamamos a analyzeText con el NUEVO parser y el NUEVO validador.
    const result = await analyzeText<TextAnalysisData>(
      prompt,
      parseSimpleTextAnalysisResponse,
      validateCommentAnalysis
    );

    return {
      isSafe: result.isLegitimate,
      success: true,
    };
  } catch (error) {
    console.error('Error analizando el comentario:', error);
    return { isSafe: false, success: false };
  }
}
