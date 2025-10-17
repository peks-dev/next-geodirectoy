import type { ImageAnalysisResult } from '@/app/(main)/contribuir/analysis/types';
import type { TextAnalysisResult } from '@/app/(main)/contribuir/analysis/types';
import { AIServiceError } from '@/lib/errors/aiErrors';

export function parseCourtAnalysisResponse(
  rawResponse: string,
  providerName: string
): ImageAnalysisResult {
  try {
    const cleanResponse = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanResponse);

    // Validar estructura mínima
    if (
      typeof parsed.isBasketballCourt !== 'boolean' ||
      typeof parsed.hasPeoplePlaying !== 'boolean'
    ) {
      throw new Error('Respuesta inválida de la IA');
    }

    return parsed as ImageAnalysisResult;
  } catch (error) {
    throw new AIServiceError(
      `No se pudo interpretar la respuesta: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      providerName
    );
  }
}

export function parseTextAnalysisResponse(
  rawResponse: string,
  providerName: string
): TextAnalysisResult {
  try {
    const cleanResponse = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    const parsed = JSON.parse(cleanResponse);

    // Validar estructura mínima
    if (
      typeof parsed.isLegitimate !== 'boolean' ||
      typeof parsed.spamScore !== 'number' ||
      !Array.isArray(parsed.reasons) ||
      typeof parsed.confidence !== 'number'
    ) {
      throw new Error('Respuesta inválida de la IA para análisis de texto');
    }

    return parsed as TextAnalysisResult;
  } catch (error) {
    throw new AIServiceError(
      `No se pudo interpretar la respuesta del análisis de texto: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      providerName
    );
  }
}
