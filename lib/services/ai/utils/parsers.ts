import { AIServiceError } from '../errors/custom';

/**
 * Parser genérico que limpia markdown y parsea JSON
 */
export function parseJSONResponse<T>(
  rawResponse: string,
  providerName: string
): T {
  try {
    const cleanResponse = rawResponse
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    if (!cleanResponse) {
      throw new Error('Respuesta vacía de la IA');
    }

    return JSON.parse(cleanResponse) as T;
  } catch (error) {
    throw new AIServiceError(
      `No se pudo parsear la respuesta JSON: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`,
      providerName
    );
  }
}
