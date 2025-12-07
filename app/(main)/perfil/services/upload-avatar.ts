import { v4 as uuidv4 } from 'uuid';
import { uploadImage } from '@/lib/supabase/storage';

export interface UploadedAvatarResult {
  avatarUrl: string;
  uploadedFilePath: string;
}

/**
 * Sube un avatar comprimido al storage
 * @param avatarFile - Archivo File del avatar comprimido
 * @param userId - ID del usuario para generar el path
 * @returns Resultado del procesamiento con URL y path del archivo
 * @throws StorageError si falla la subida
 */
export async function uploadAvatar(
  avatarFile: File,
  userId: string
): Promise<UploadedAvatarResult> {
  // Validar que sea un archivo válido
  if (!avatarFile || avatarFile.size === 0) {
    throw new Error('Archivo de avatar inválido');
  }

  // Generar nombre único para el archivo
  const extension = avatarFile.type.split('/')[1]; // 'jpeg', 'png', 'webp'
  const fileName = `${uuidv4()}.${extension}`;
  const filePath = `${userId}/${fileName}`;

  // Subir usando la función de storage (lanza StorageError si falla)
  const uploadResult = await uploadImage(avatarFile, 'AVATARS', filePath);

  return {
    avatarUrl: uploadResult.url,
    uploadedFilePath: uploadResult.path,
  };
}
