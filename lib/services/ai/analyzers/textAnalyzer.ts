import { getAIService } from '../core/aiFactory';
import { AIUnavailableError, AIServiceError } from '../errors/custom';
import type { ParseFunction, ValidateFunction } from '../core/types';
import type { TextAnalysisOptions } from './types';

/**
 * Analizador genérico de texto
 * Similar a images pero sin archivos adjuntos
 */
export async function analyzeText<TRaw, TValidated>(
  options: TextAnalysisOptions,
  parser: ParseFunction<TRaw>,
  validator: ValidateFunction<TRaw, TValidated>
): Promise<TValidated> {
  const { prompt, texts } = options;

  // Preparar el prompt reemplazando placeholders
  let finalPrompt = prompt;
  for (const [key, value] of Object.entries(texts)) {
    finalPrompt = finalPrompt.replace(`{${key}}`, value);
  }

  const aiService = getAIService();

  // Verificar disponibilidad
  const isAvailable = await aiService.isAvailable();
  if (!isAvailable) {
    throw new AIUnavailableError(aiService.provider);
  }

  // Generar análisis (sin imágenes)
  const rawResponse = await aiService.generateContent(finalPrompt, []);

  // Parsear respuesta
  const parsedData = parser(rawResponse, aiService.provider);

  // Validar resultado
  const validationResult = validator(parsedData);

  if (!validationResult.success) {
    throw new AIServiceError(
      `Validación fallida: ${validationResult.errors.join('. ')}`,
      aiService.provider
    );
  }

  return validationResult.data;
}
