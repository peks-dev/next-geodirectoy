import { getAIService } from '@/lib/ai/aiFactory';
import { parseTextAnalysisResponse } from '@/lib/ai/parsers';
import { validateTextAnalysis } from '@/app/(main)/contribuir/analysis/validators';
import { COMMUNITY_TEXT_ANALYSIS_PROMPT } from '@/app/(main)/contribuir/analysis/prompts';
import { CommunityTextAnalysisResult } from '@/app/(main)/contribuir/analysis/types';
import { AIUnavailableError, AIServiceError } from '@/lib/errors/aiErrors';

// Tipos para un resultado de validación más estricto y claro.
// Esto nos permite evitar `any` y `unknown` más adelante.
type ValidationSuccess<T> = { success: true; data: T };
type ValidationFailure = { success: false; errors: string[] };
type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

// Interfaz para el dato que esperamos una vez validado.
interface TextAnalysisData {
  isLegitimate: boolean;
}

export async function analyzeText<T>(
  prompt: string,
  parseFn: (rawResponse: string, provider: string) => unknown,
  validateFn: (parsedData: unknown) => ValidationResult<T>
): Promise<T> {
  const aiService = getAIService();

  const isAvailable = await aiService.isAvailable();
  if (!isAvailable) {
    throw new AIUnavailableError(aiService.provider);
  }

  try {
    const rawResponse = await aiService.generateContent(prompt, []);
    const analysisResult = parseFn(rawResponse, aiService.provider);
    const validationResult = validateFn(analysisResult);

    if (!validationResult.success) {
      throw new AIServiceError(
        `Texto rechazado: ${validationResult.errors.join('. ')}`,
        aiService.provider
      );
    }
    // Si la validación fue exitosa, .data está garantizado que existe y es de tipo T.
    return validationResult.data;
  } catch (error) {
    if (
      error instanceof AIUnavailableError ||
      error instanceof AIServiceError
    ) {
      throw error;
    }
    throw new AIServiceError(
      `Error durante el análisis de texto: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
      aiService.provider
    );
  }
}

export interface CommunityTexts {
  name: string;
  description: string;
}

export async function analyzeTextsCommunity(
  texts: CommunityTexts
): Promise<CommunityTextAnalysisResult> {
  const prompt = COMMUNITY_TEXT_ANALYSIS_PROMPT.replace(
    '{name}',
    texts.name
  ).replace('{description}', texts.description);

  try {
    // Especificamos explícitamente el tipo de dato que esperamos después de la validación.
    const result = await analyzeText<TextAnalysisData>(
      prompt,
      parseTextAnalysisResponse,
      validateTextAnalysis as (
        parsedData: unknown
      ) => ValidationResult<TextAnalysisData>
    );

    // Ahora TypeScript sabe que `result` es de tipo `TextAnalysisData`.
    return {
      isValid: result.isLegitimate,
      success: true,
    };
  } catch (error) {
    // Centralizamos el manejo de errores para agregar contexto.
    console.log(error);
    const message =
      error instanceof Error ? error.message : 'Error desconocido';

    // Asumimos que los errores personalizados siempre tienen un `provider`.
    // Para otros errores, usamos 'unknown' como fallback.
    const provider =
      error instanceof AIServiceError || error instanceof AIUnavailableError
        ? error.provider
        : 'unknown';

    throw new AIServiceError(
      `Error analizando texto de la comunidad: ${message}`,
      provider
    );
  }
}
