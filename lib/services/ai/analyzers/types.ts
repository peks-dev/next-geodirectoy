/**
 * Tipos para análisis de imágenes
 */
export interface ImageAnalysisOptions {
  prompt: string;
  images: File[];
  minImages?: number;
  maxImages?: number;
}

/**
 * Tipos para análisis de texto
 */
export interface TextAnalysisOptions {
  prompt: string;
  texts: Record<string, string>; // { fieldName: value }
}
