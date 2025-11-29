// Errores específicos para el sistema de IA
export class AIServiceError extends Error {
  constructor(
    message: string,
    public provider: string
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export class ImageValidationError extends Error {
  constructor(
    message: string,
    public validationType: 'basketball' | 'people'
  ) {
    super(message);
    this.name = 'ImageValidationError';
  }
}

export class AIUnavailableError extends Error {
  constructor(public provider: string) {
    super(`El servicio de IA (${provider}) no está disponible`);
    this.name = 'AIUnavailableError';
  }
}

// Mensajes de error predefinidos
export const AI_ERROR_MESSAGES = {
  NOT_BASKETBALL_COURT:
    'Las imágenes no parecen ser de una cancha de baloncesto',
  NO_PEOPLE_PLAYING:
    'No se detectaron personas jugando en las imágenes. Se requieren al menos 2 personas',
  ANALYSIS_FAILED:
    'No se pudo analizar las imágenes. Intenta con otras imágenes más claras',
  SERVICE_UNAVAILABLE: 'El servicio de análisis de imágenes no está disponible',
  INVALID_IMAGE_FORMAT: 'Formato de imagen no válido. Usa JPG, PNG o WEBP',
} as const;
