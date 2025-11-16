/**
 * Compresión de imágenes en el navegador usando Canvas API
 *
 * NOTA: Las validaciones de tipo/estructura se hacen con Zod antes de llamar esta función.
 * Esta función solo maneja validaciones técnicas runtime que Zod no puede hacer.
 */

export interface CompressionOptions {
  /** Calidad JPEG (0-1), menor = más compresión. Default: 0.85 */
  quality?: number;
  /** Ancho máximo en píxeles. Default: 1024 */
  maxWidth?: number;
  /** Alto máximo en píxeles. Default: 1024 */
  maxHeight?: number;
  /** Tamaño máximo del archivo original (límite técnico). Default: 10MB */
  maxInputSize?: number;
  /** Tamaño objetivo después de comprimir. Default: 500KB */
  targetSize?: number;
}

export class ImageCompressionError extends Error {
  constructor(
    message: string,
    public code:
      | 'TOO_LARGE'
      | 'LOAD_FAILED'
      | 'COMPRESSION_FAILED'
      | 'BROWSER_NOT_SUPPORTED'
  ) {
    super(message);
    this.name = 'ImageCompressionError';
  }
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    quality = 0.85,
    maxWidth = 1024,
    maxHeight = 1024,
    maxInputSize = 10 * 1024 * 1024, // 10MB
    targetSize = 500 * 1024, // 500KB
  } = options;

  // Validación técnica: límite del navegador para prevenir congelamiento
  if (file.size > maxInputSize) {
    throw new ImageCompressionError(
      `Image too large for browser processing (${(file.size / 1024 / 1024).toFixed(1)}MB, max: ${maxInputSize / 1024 / 1024}MB)`,
      'TOO_LARGE'
    );
  }

  // Optimización: si ya es pequeño, no procesar
  if (file.size <= targetSize) {
    return file;
  }

  // Verificar soporte de Canvas
  if (typeof document === 'undefined' || !document.createElement) {
    throw new ImageCompressionError(
      'Canvas API not available in this environment',
      'BROWSER_NOT_SUPPORTED'
    );
  }

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(
        new ImageCompressionError(
          'Failed to get Canvas 2D context',
          'BROWSER_NOT_SUPPORTED'
        )
      );
      return;
    }

    const img = new Image();

    img.onload = () => {
      try {
        // Calcular nuevas dimensiones manteniendo aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Configurar canvas
        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            // Limpiar memoria
            URL.revokeObjectURL(img.src);

            if (!blob) {
              reject(
                new ImageCompressionError(
                  'Canvas failed to generate blob',
                  'COMPRESSION_FAILED'
                )
              );
              return;
            }

            // Crear nuevo File
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        URL.revokeObjectURL(img.src);
        reject(
          new ImageCompressionError(
            `Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            'COMPRESSION_FAILED'
          )
        );
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(
        new ImageCompressionError(
          `Failed to load image: ${file.name}`,
          'LOAD_FAILED'
        )
      );
    };

    img.src = URL.createObjectURL(file);
  });
}
