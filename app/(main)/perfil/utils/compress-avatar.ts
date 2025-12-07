import {
  compressImage,
  ImageCompressionError,
} from '@/lib/utils/images/compressImage';
import { fileToBase64 } from '@/lib/utils/images/imagesTransform';

export interface CompressedAvatarData {
  data: string;
  name: string;
  type: 'image/jpeg' | 'image/png' | 'image/webp';
  size: number;
}

export interface ProcessedAvatarData {
  compressedAvatar: CompressedAvatarData;
}

/**
 * Procesa un archivo de imagen para subirlo al perfil
 * Incluye compresión, conversión a base64 y validación
 * @param file - Archivo de imagen a procesar
 * @returns Datos del avatar procesado listos para enviar
 * @throws ImageCompressionError si falla el procesamiento
 */
export async function compressAvatar(file: File): Promise<ProcessedAvatarData> {
  try {
    // Comprimir la imagen
    const compressedFile = await compressImage(file, {
      maxWidth: 512,
      maxHeight: 512,
      targetSize: 200 * 1024, // 200KB
      quality: 0.85,
    });

    // Convertir a base64
    const base64 = await fileToBase64(compressedFile);

    // Preparar datos para el action
    const compressedAvatar: CompressedAvatarData = {
      data: base64,
      name: compressedFile.name,
      type: compressedFile.type as 'image/jpeg' | 'image/png' | 'image/webp',
      size: compressedFile.size,
    };

    return { compressedAvatar };
  } catch (error) {
    // Re-lanzar errores de compresión con contexto adicional
    if (error instanceof ImageCompressionError) {
      throw error;
    }

    // Para otros errores, crear un error genérico de compresión
    throw new ImageCompressionError(
      'Error al procesar la imagen. Intenta con otra.',
      'COMPRESSION_FAILED'
    );
  }
}
