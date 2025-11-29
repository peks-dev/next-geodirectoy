import { getAIService } from '@/lib/ai/aiFactory';
import { parseTextAnalysisResponse } from '@/lib/ai/parsers';
import { validateTextAnalysis } from './validators';
import { COMMUNITY_TEXT_ANALYSIS_PROMPT } from './prompts';
import type { CommunityTextAnalysisResult } from '../analysis/types';
import { AIUnavailableError, AIServiceError } from '@/lib/ai/aiErrors';

export interface CommunityTexts {
  name: string;
  description: string;
}

export async function analyzeTextsCommunity(
  texts: CommunityTexts
): Promise<CommunityTextAnalysisResult> {
  const aiService = getAIService();

  // Verificar disponibilidad del servicio
  const isAvailable = await aiService.isAvailable();
  if (!isAvailable) {
    throw new AIUnavailableError(aiService.provider);
  }

  try {
    // Preparar el prompt con los textos
    const prompt = COMMUNITY_TEXT_ANALYSIS_PROMPT.replace(
      '{name}',
      texts.name
    ).replace('{description}', texts.description);

    // Para análisis de texto no necesitamos imágenes, pasamos array vacío
    const rawResponse = await aiService.generateContent(prompt, []);

    // Parsear la respuesta
    const analysisResult = parseTextAnalysisResponse(
      rawResponse,
      aiService.provider
    );

    // Validar el resultado
    const validationResult = validateTextAnalysis(analysisResult);

    if (!validationResult.success || !validationResult.data) {
      throw new AIServiceError(
        `Texto rechazado: ${validationResult.errors.join('. ')}`,
        aiService.provider
      );
    }

    return {
      isValid: validationResult.data.isLegitimate,
      success: true,
    };
  } catch (error) {
    if (
      error instanceof AIUnavailableError ||
      error instanceof AIServiceError
    ) {
      throw error;
    }

    throw new AIServiceError(
      `Error analizando texto de la comunidad: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      aiService.provider
    );
  }
}
