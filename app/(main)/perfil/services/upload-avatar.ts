import { v4 as uuidv4 } from 'uuid';
import { base64ToBuffer } from '@/lib/utils/images/imagesTransform';
import { uploadImage } from '@/lib/supabase/storage';
import type { CompressedAvatarData } from '../utils';

export interface UploadedAvatarResult {
  avatarUrl: string;
  uploadedFilePath: string;
}

/**
 * Sube un avatar comprimido al storage
 * @param compressedAvatar - Datos del avatar comprimido
 * @param userId - ID del usuario para generar el path
 * @returns Resultado del procesamiento con URL y path del archivo
 * @throws StorageError si falla la subida
 */
export async function uploadAvatar(
  compressedAvatar: CompressedAvatarData,
  userId: string
): Promise<UploadedAvatarResult> {
  const { data: base64Data, name, type } = compressedAvatar;

  // Convertir base64 a Buffer
  const buffer = base64ToBuffer(base64Data);

  // Generar nombre único para el archivo
  const extension = type.split('/')[1]; // 'jpeg', 'png', 'webp'
  const fileName = `${uuidv4()}.${extension}`;
  const filePath = `${userId}/${fileName}`;

  // Crear File object desde el buffer
  const file = new File([buffer], name, { type });

  // Subir usando la función de storage (lanza StorageError si falla)
  const uploadResult = await uploadImage(file, 'AVATARS', filePath);

  return {
    avatarUrl: uploadResult.url,
    uploadedFilePath: uploadResult.path,
  };
}
