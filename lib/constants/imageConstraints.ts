export const IMAGE_CONSTRAINTS = {
  /** Tamaño máximo del archivo original antes de comprimir */
  MAX_INPUT_SIZE: 10 * 1024 * 1024, // 10MB
  /** Tamaño objetivo después de comprimir */
  TARGET_SIZE: 200 * 1024, // 200KB
  /** Tamaño máximo del base64 para enviar al servidor */
  MAX_BASE64_SIZE: 2 * 1024 * 1024, // 2MB
  /** Dimensiones máximas para avatares */
  AVATAR_MAX_WIDTH: 512,
  AVATAR_MAX_HEIGHT: 512,
  /** Calidad de compresión JPEG */
  COMPRESSION_QUALITY: 0.85,
  /** Tipos de imagen permitidos */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
} as const;
