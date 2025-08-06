import sharp from 'sharp';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
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

// Crear cliente de Supabase
async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorar errores en Server Components
          }
        },
      },
    }
  );
}

// Validar archivo (ejemplo básico)
function validateFile(file: File): { valid: boolean; error?: string } {
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
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    const supabase = await createClient();

    // Leer el archivo como buffer
    const buffer = await file.arrayBuffer();

    // Optimizar con Sharp
    const optimizedBuffer = await sharp(buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside' }) // Tamaño máximo, ajusta según necesites
      .toFormat('jpeg', { quality: 80 }) // Comprimir a JPEG
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
