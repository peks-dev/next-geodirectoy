import sharp from 'sharp';
import { createClient } from './server';
import { v4 as uuidv4 } from 'uuid';

// Definir los buckets
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  COMMUNITIES: 'communities',
} as const;

// Tipo para el resultado de la subida
export type UploadResult = {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
};

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
  userId: string,
  path?: string
): Promise<UploadResult> {
  // ... (el resto de la función no necesita cambios)
  try {
    const supabase = await createClient(); // Ahora usa la función importada

    // Leer el archivo como buffer
    const buffer = await file.arrayBuffer();

    // Optimizar con Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside' })
      .toFormat('jpeg', { quality: 80 })
      .toBuffer();

    // Crear un nuevo archivo optimizado
    const optimizedFile = new File([optimizedBuffer], file.name, {
      type: 'image/jpeg',
    });

    // Generar nombre de archivo único si no se proporciona path
    const fileExtension = 'jpeg';
    const fileName = path || `${uuidv4()}.${fileExtension}`;
    const filePath = `${userId}/${bucket}/${fileName}`;

    // Subir a Supabase
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error al subir:', error);
      return { success: false, error: error.message };
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(data.path);

    return {
      success: true,
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (error) {
    console.error('Error inesperado:', error);
    return { success: false, error: 'Error inesperado al subir la imagen' };
  }
}
