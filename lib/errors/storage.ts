// lib/errors/storage.ts
import { ErrorCodes } from './codes';

/**
 * Error para operaciones de almacenamiento (Supabase Storage)
 * Incluye: upload, download, delete de archivos/imágenes
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: keyof typeof ErrorCodes,
    public details?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
    Object.setPrototypeOf(this, StorageError.prototype);
  }
}

/**
 * Helper para convertir errores de Supabase Storage
 */
export function fromSupabaseStorageError(
  error: { message: string; statusCode?: string },
  userMessage: string,
  errorCode: keyof typeof ErrorCodes
): StorageError {
  return new StorageError(userMessage, errorCode, {
    supabaseMessage: error.message,
    statusCode: error.statusCode,
  });
}

/**
 * Valida el tipo de archivo (imágenes)
 * @throws StorageError si el tipo no es válido
 */
export function validateImageType(file: File): void {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!validTypes.includes(file.type)) {
    throw new StorageError(
      'Formato de imagen no válido. Usa JPG, PNG o WEBP',
      ErrorCodes.INVALID_FILE_TYPE,
      { providedType: file.type, validTypes }
    );
  }
}

/**
 * Valida el tamaño del archivo
 * @throws StorageError si excede el límite
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): void {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    throw new StorageError(
      `La imagen excede el tamaño máximo de ${maxSizeMB}MB`,
      ErrorCodes.FILE_TOO_LARGE,
      {
        fileSize: file.size,
        maxSize: maxSizeBytes,
        fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
      }
    );
  }
}

/**
 * Valida cantidad de archivos
 * @throws StorageError si no cumple con el rango
 */
export function validateFileCount(
  files: File[],
  min: number,
  max: number
): void {
  if (files.length < min) {
    throw new StorageError(
      `Se requieren al menos ${min} imágenes`,
      ErrorCodes.INSUFFICIENT_IMAGES,
      { provided: files.length, required: min }
    );
  }

  if (files.length > max) {
    throw new StorageError(
      `No puedes subir más de ${max} imágenes`,
      ErrorCodes.TOO_MANY_IMAGES,
      { provided: files.length, max }
    );
  }
}
