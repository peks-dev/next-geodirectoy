export const AI_ERROR_MESSAGES = {
  NOT_BASKETBALL_COURT:
    'Las imágenes no parecen ser de una cancha de baloncesto',
  NO_PEOPLE_PLAYING:
    'No se detectaron personas jugando. Se requieren al menos 2 personas en las fotos',
  ANALYSIS_FAILED:
    'No se pudo analizar las imágenes. Intenta con fotos más claras',
  SERVICE_UNAVAILABLE:
    'El servicio de análisis de imágenes no está disponible temporalmente',
  INVALID_IMAGE_FORMAT: 'Formato de imagen no válido. Usa JPG, PNG o WEBP',
  INAPPROPRIATE_CONTENT: 'Se detectó contenido inapropiado en las imágenes',
  RATE_LIMIT_EXCEEDED:
    'Se ha excedido el límite de análisis. Intenta de nuevo en unos minutos',
  TIMEOUT: 'El análisis tardó demasiado tiempo. Intenta de nuevo',
} as const;
