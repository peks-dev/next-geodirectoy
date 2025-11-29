// Tipos para la REST API de Gemini
export interface GeminiInlineData {
  inline_data: {
    mime_type: string;
    data: string; // base64
  };
}

export interface GeminiTextPart {
  text: string;
}

export type GeminiPart = GeminiInlineData | GeminiTextPart;

export interface GeminiRequest {
  contents: Array<{
    parts: GeminiPart[];
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
}
