import type { BaseAIService, AIProvider } from './types';
import { GeminiService } from './services/geminiService';
import { AIUnavailableError } from '@/lib/ai/aiErrors';

function createAIService(): BaseAIService {
  // Lee el proveedor desde variables de entorno (default: gemini)
  const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER ||
    'gemini') as AIProvider;

  switch (provider) {
    case 'gemini': {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error(
          'GEMINI_API_KEY no está configurada en .env.local. ' +
            'Agrega: GEMINI_API_KEY=tu_api_key'
        );
      }

      return new GeminiService(apiKey);
    }

    case 'ollama': {
      throw new AIUnavailableError(
        'Ollama aún no está implementado. Usa NEXT_PUBLIC_AI_PROVIDER=gemini'
      );
    }

    default:
      throw new AIUnavailableError(
        `Proveedor desconocido: ${provider}. Opciones válidas: 'gemini', 'ollama'`
      );
  }
}

let aiServiceInstance: BaseAIService | null = null;

export function getAIService(): BaseAIService {
  if (!aiServiceInstance) {
    aiServiceInstance = createAIService();
  }
  return aiServiceInstance;
}

/**
 * Útil para testing: resetea el singleton
 * NO uses esto en producción
 */
export function resetAIService(): void {
  aiServiceInstance = null;
}
