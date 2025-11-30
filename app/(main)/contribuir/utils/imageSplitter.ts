/**
 * Utilidad para separar imágenes nuevas (File) de existentes (URLs string)
 * Útil para AI analysis y upload services
 */

export function separateNewAndExistingImages(images: (File | string)[]): {
  newFiles: File[];
  existingUrls: string[];
} {
  const newFiles: File[] = images.filter(
    (img): img is File => img instanceof File
  );
  const existingUrls: string[] = images.filter(
    (img): img is string => typeof img === 'string'
  );

  return { newFiles, existingUrls };
}
