// Esta es la "firma del contrato" que cualquier AI debe cumplir
export interface BaseAIService {
  // Método principal: envía prompt + imágenes, recibe texto
  generateContent(prompt: string, images: File[]): Promise<string>;

  // Verifica disponibilidad del servicio
  isAvailable(): Promise<boolean>;

  // Nombre del proveedor (para logging/debugging)
  readonly provider: string;
}

// Configuración para cada proveedor
export type AIProvider = 'gemini' | 'ollama';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string; // Solo para servicios externos como Gemini
  endpoint?: string; // Solo para servicios self-hosted como Ollama
}
