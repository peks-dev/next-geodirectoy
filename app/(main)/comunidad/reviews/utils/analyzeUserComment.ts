import { analyzeText } from '@/lib/services/ai/analyzers/textAnalyzer';
import { COMMENT_ANALYSIS_PROMPT } from '../prompts';

// Definimos la "forma" del objeto que esperamos recibir de la validación.
interface TextAnalysisData {
  isLegitimate: boolean;
}

// Creamos un parser que convierte la respuesta en el tipo esperado
function parseCommentAnalysisResponse(
  rawResponse: string,
  _providerName: string
): unknown {
  try {
    const cleanResponse = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    if (!cleanResponse) {
      throw new Error('La respuesta de la IA está vacía.');
    }

    return JSON.parse(cleanResponse);
  } catch (error) {
    throw new Error(
      `No se pudo interpretar la respuesta JSON: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
}

// Creamos un validador simple y específico para esta tarea.
function validateCommentAnalysis(
  parsedData: unknown
):
  | { success: true; data: TextAnalysisData }
  | { success: false; errors: string[] } {
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
  try {
    // Llamamos a analyzeText con el parser y validador personalizados.
    const result = await analyzeText<unknown, TextAnalysisData>(
      {
        prompt: COMMENT_ANALYSIS_PROMPT,
        texts: { comment: commentText },
      },
      parseCommentAnalysisResponse,
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
