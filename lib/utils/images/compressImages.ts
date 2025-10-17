/**
 * Compresión de imágenes en el navegador usando Canvas API
 * Para enviar a Server Actions sin superar límites de tamaño
 */

export interface ClientCompressionOptions {
  /** Calidad (0-1), menor = más compresión */
  quality?: number;
  /** Ancho máximo en píxeles */
  maxWidth?: number;
  /** Alto máximo en píxeles */
  maxHeight?: number;
  /** Tamaño máximo del archivo en bytes */
  maxSizeBytes?: number;
}

/**
 * Comprime una imagen usando Canvas API del navegador
 */
export async function compressImageClient(
  file: File,
  options: ClientCompressionOptions = {}
): Promise<File> {
  const {
    quality = 0.85,
    maxWidth = 1024,
    maxHeight = 1024,
    // maxSizeBytes = 400 * 1024,
  } = options;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo aspect ratio
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // Configurar canvas
      canvas.width = width;
      canvas.height = height;

      // Dibujar imagen redimensionada
      ctx!.drawImage(img, 0, 0, width, height);

      // Convertir a blob
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file); // Si falla, devolver original
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
    };

    img.onerror = () => resolve(file); // Si falla, devolver original
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Comprime múltiples imágenes
 */
export async function compressImagesClient(
  files: File[],
  options: ClientCompressionOptions = {}
): Promise<File[]> {
  return Promise.all(files.map((file) => compressImageClient(file, options)));
}
