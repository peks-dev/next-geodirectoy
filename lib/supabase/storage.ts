import sharp from 'sharp';
import { createClient } from './server';
import { v4 as uuidv4 } from 'uuid';

// Definir los buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  COMMUNITIES: 'community-images',
} as const;

// Tipo para el resultado de la subida
export type UploadResult = {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
};

// Objeto de opciones para la subida de imágenes de comunidad
export interface CommunityImageUploadOptions {
  userId: string;
  communityId: string;
}

// Validar archivo (ejemplo básico)
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'El archivo excede el tamaño máximo de 5MB' };
  }
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'El archivo debe ser una imagen' };
  }
  return { valid: true };
}

// Función para subir y optimizar imagen
export async function uploadImage(
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  options: CommunityImageUploadOptions
): Promise<UploadResult> {
  try {
    const supabase = await createClient();

    // Validar y optimizar la imagen con Sharp
    const buffer = await file.arrayBuffer();
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    const optimizedFile = new File([optimizedBuffer], file.name, {
      type: 'image/jpeg',
    });

    // Crear el path del archivo con la estructura deseada: userId/communityId/imageName.jpeg
    const fileName = `${uuidv4()}.jpeg`;
    const filePath = `${options.userId}/${options.communityId}/${fileName}`;

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: false, // Usamos false para evitar sobreescribir si hubiera colisión (muy improbable con UUID)
      });

    if (error) {
      console.error('Error al subir a Supabase Storage:', error);
      return { success: false, error: error.message };
    }

    // Obtener la URL pública de la imagen subida
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Error inesperado en uploadImage:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido.';
    return {
      success: false,
      error: `Error inesperado al subir la imagen: ${errorMessage}`,
    };
  }
}

export async function deleteImages(
  filePaths: string[],
  bucket: keyof typeof STORAGE_BUCKETS
): Promise<{ success: boolean; error?: string }> {
  if (filePaths.length === 0) {
    return { success: true }; // No hay nada que hacer
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove(filePaths);

    if (error) {
      console.error('Error al eliminar imágenes de Supabase Storage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido.';
    return {
      success: false,
      error: `Error inesperado al eliminar imágenes: ${errorMessage}`,
    };
  }
}
