import { compressImagesClient } from '@/lib/utils/images/compressImages';
import type { CommunityFormData } from '@/app/types/communityTypes';

export interface CompressImagesResult {
  compressedImages: (File | string)[];
}

export async function compressAndUpdateImages(
  formData: CommunityFormData
): Promise<CompressImagesResult> {
  if (formData.images.length === 0) {
    return { compressedImages: [] };
  }

  try {
    // Separar imágenes por tipo
    const imageFiles = formData.images.filter(
      (img): img is File => img instanceof File
    );

    const imageStrings = formData.images.filter(
      (img): img is string => typeof img === 'string'
    );

    if (imageFiles.length === 0) {
      return { compressedImages: imageStrings };
    }

    const compressedImages = await compressImagesClient(imageFiles, {
      quality: 0.85,
      maxWidth: 1024,
      maxHeight: 1024,
      maxSizeBytes: 400 * 1024, // 400KB máximo por imagen
    });

    // Combinar imágenes string existentes con las nuevas comprimidas
    const allImages = [...imageStrings, ...compressedImages];

    return { compressedImages: allImages };
  } catch (error) {
    console.error('Error comprimiendo imágenes:', error);
    throw error; // Re-lanzar para que handleSubmit pueda manejar el error
  }
}
