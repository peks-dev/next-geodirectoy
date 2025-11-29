// lib/errors/ai.ts
import { ErrorCodes } from './codes';
import { AI_ERROR_MESSAGES } from './messages';

/**
 * Error para operaciones con servicios de IA (Gemini, etc.)
 */
export class AIError extends Error {
  constructor(
    message: string,
    public code: keyof typeof ErrorCodes,
    public provider: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AIError';
    Object.setPrototypeOf(this, AIError.prototype);
  }
}

/**
 * Tipos específicos de validación de imágenes
 */
export type ImageValidationType =
  | 'basketball_court'
  | 'people_playing'
  | 'inappropriate_content';

/**
 * Error específico para validación de imágenes
 * Extiende AIError con información más específica
 */
export class ImageValidationError extends AIError {
  constructor(
    message: string,
    code: keyof typeof ErrorCodes,
    provider: string,
    public validationType: ImageValidationType,
    details?: unknown
  ) {
    super(message, code, provider, details);
    this.name = 'ImageValidationError';
    Object.setPrototypeOf(this, ImageValidationError.prototype);
  }
}

/**
 * Verifica si el servicio de IA está disponible
 * @throws AIError si no está disponible
 */
export async function ensureAIServiceAvailable(aiService: {
  isAvailable: () => Promise<boolean>;
  provider: string;
}): Promise<void> {
  const isAvailable = await aiService.isAvailable();

  if (!isAvailable) {
    throw new AIError(
      AI_ERROR_MESSAGES.SERVICE_UNAVAILABLE,
      ErrorCodes.AI_UNAVAILABLE,
      aiService.provider
    );
  }
}

/**
 * Helper para manejar timeouts en operaciones de IA
 */
export async function withAITimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  provider: string
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new AIError(
          AI_ERROR_MESSAGES.TIMEOUT,
          ErrorCodes.AI_TIMEOUT,
          provider,
          { timeoutMs }
        )
      );
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Parsea errores de la API de Gemini
 */
export function fromGeminiError(
  error: unknown,
  userMessage: string,
  errorCode: keyof typeof ErrorCodes
): AIError {
  const provider = 'Gemini';

  if (error instanceof Error) {
    // Detectar rate limit
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      return new AIError(
        AI_ERROR_MESSAGES.RATE_LIMIT_EXCEEDED,
        ErrorCodes.AI_RATE_LIMIT,
        provider,
        { originalError: error.message }
      );
    }

    // Detectar timeout
    if (
      error.message.includes('timeout') ||
      error.message.includes('timed out')
    ) {
      return new AIError(
        AI_ERROR_MESSAGES.TIMEOUT,
        ErrorCodes.AI_TIMEOUT,
        provider,
        { originalError: error.message }
      );
    }

    return new AIError(userMessage, errorCode, provider, {
      originalError: error.message,
      stack: error.stack,
    });
  }

  return new AIError(userMessage, errorCode, provider, { error });
}
