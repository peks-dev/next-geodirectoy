import { getAIService } from '../core/aiFactory';
import { AIUnavailableError, AIServiceError } from '../errors/custom';
import type {
  ParseFunction,
  ValidateFunction,
  ValidationResult,
} from '../core/types';
import type { ImageAnalysisOptions } from './types';

/**
 * Analizador genérico de imágenes
 * Recibe opciones, funciones de parsing y validación
 */
export async function analyzeImages<TRaw, TValidated>(
  options: ImageAnalysisOptions,
  parser: ParseFunction<TRaw>,
  validator: ValidateFunction<TRaw, TValidated>
): Promise<TValidated> {
  const { prompt, images, minImages = 1, maxImages = 10 } = options;

  // Validar cantidad de imágenes
  if (images.length < minImages || images.length > maxImages) {
    throw new AIServiceError(
      `Se requieren entre ${minImages} y ${maxImages} imágenes, recibidas: ${images.length}`,
      'validation'
    );
  }

  const aiService = getAIService();

  // Verificar disponibilidad
  const isAvailable = await aiService.isAvailable();
  if (!isAvailable) {
    throw new AIUnavailableError(aiService.provider);
  }

  // Generar análisis
  const rawResponse = await aiService.generateContent(prompt, images);

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
