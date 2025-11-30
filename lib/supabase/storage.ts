import { createClient } from './server';
import { fromSupabaseError } from '@/lib/errors/database';
import { ErrorCodes } from '@/lib/errors/codes';

// Definir los buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  COMMUNITIES: 'community-images',
} as const;

export async function uploadImage(
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  filePath: string,
  cacheControl: string = '3600',
  upsert: boolean = false
): Promise<{ url: string; path: string }> {
  const supabase = await createClient();

  // Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .upload(filePath, file, {
      cacheControl,
      upsert,
    });

  if (error) {
    throw fromSupabaseError(
      error,
      'Error al subir imagen',
      ErrorCodes.UPLOAD_FAILED
    );
  }

  // Obtener la URL pública
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .getPublicUrl(data.path);

  return {
    url: urlData.publicUrl,
    path: data.path,
  };
}

export async function deleteImage(
  filePath: string,
  bucket: keyof typeof STORAGE_BUCKETS
): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS[bucket])
    .remove([filePath]);

  if (error) {
    throw fromSupabaseError(
      error,
      'Error al eliminar imagen',
      ErrorCodes.DELETE_FAILED
    );
  }
}
