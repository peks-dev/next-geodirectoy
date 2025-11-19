import { createClient } from './server';

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

export async function uploadImage(
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string,
  cacheControl: string = '3600',
  upsert: boolean = false
): Promise<UploadResult> {
  try {
    const supabase = await createClient();

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, file, {
        cacheControl,
        upsert,
      });

    if (error) {
      console.error('Error al subir a Supabase Storage:', error);
      return { success: false, error: error.message };
    }

    // Obtener la URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: `Error inesperado al subir la imagen: ${errorMessage}`,
    };
  }
}

export async function deleteImage(
  filePath: string,
  bucket: keyof typeof STORAGE_BUCKETS
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove([filePath]);

    if (error) {
      console.error('Error al eliminar imagen de Supabase Storage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Error desconocido';
    return {
      success: false,
      error: `Error inesperado al eliminar imagen: ${errorMessage}`,
    };
  }
}
