// Tipos crudos de la respuesta de IA
export interface ProfileImageAnalysisRaw {
  isAppropriate: boolean;
  confidence: number;
}

// Tipos validados para el dominio
export interface ProfileImageAnalysisResult {
  isValid: boolean;
  confidence: number;
  success: true;
}

// Input del servicio
export interface ProfileAnalysisInput {
  image: File;
}
