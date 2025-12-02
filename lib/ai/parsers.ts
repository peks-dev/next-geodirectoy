import type { CourtImageAnalysisResult } from '@/comunidad/contribuir/services/analyzeCommunity/types';
import type { CommunityTextAnalysisResult } from '@/comunidad/contribuir/services/analyzeCommunity/types';
import { AIServiceError } from '@/lib/ai/aiErrors';

export function parseSimpleTextAnalysisResponse(
  rawResponse: string,
  providerName: string
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
    throw new AIServiceError(
      `No se pudo interpretar la respuesta JSON del análisis: ${error instanceof Error ? error.message : 'Respuesta mal formada'}`,
      providerName
    );
  }
}

export function parseCourtAnalysisResponse(
  rawResponse: string,
  providerName: string
): CourtImageAnalysisResult {
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

    return parsed as CourtImageAnalysisResult;
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
): CommunityTextAnalysisResult {
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

    return parsed as CommunityTextAnalysisResult;
  } catch (error) {
    throw new AIServiceError(
      `No se pudo interpretar la respuesta del análisis de texto: ${error instanceof Error ? error.message : 'Error desconocido'}`,
      providerName
    );
  }
}
