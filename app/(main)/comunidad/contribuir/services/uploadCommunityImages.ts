import { deleteImage, uploadImage } from '@/lib/supabase/storage';
import { extractStoragePath } from '@/lib/utils/extractStoragePath';
import { v4 as uuidv4 } from 'uuid';

/**
 * Servicio para procesar imágenes en update de comunidad
 * - Elimina imágenes existentes no mantenidas (oldUrls - existingUrls)
 * - Sube imágenes nuevas (newFiles)
 * - Retorna paths para rollback en caso de error
 */
export async function uploadCommunityImages(
  oldUrls: string[], // Imágenes existentes en DB
  existingUrls: string[], // Imágenes que usuario mantiene
  newFiles: File[], // Solo imágenes nuevas (File[])
  userId: string, // Para path de storage
  communityId: string // Para path de storage
): Promise<{ uploadedUrls: string[]; uploadedPaths: string[] }> {
  let uploadedUrls: string[] = [];
  let uploadedPaths: string[] = [];

  // 1. Eliminar imágenes existentes no mantenidas
  const urlsToDelete = oldUrls.filter((url) => !existingUrls.includes(url));

  if (urlsToDelete.length > 0) {
    const pathsToDelete = urlsToDelete.map(extractStoragePath);
    await Promise.all(
      pathsToDelete.map((path) => deleteImage(path, 'COMMUNITIES'))
    );
  }

  // 2. Subir imágenes nuevas
  if (newFiles.length > 0) {
    const uploadResults = await Promise.all(
      newFiles.map(async (file) => {
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv4()}.${fileExtension}`;
        const filePath = `${userId}/${communityId}/${fileName}`;

        const { url, path } = await uploadImage(file, 'COMMUNITIES', filePath);
        return { url, path };
      })
    );

    uploadedUrls = uploadResults.map((r) => r.url);
    uploadedPaths = uploadResults.map((r) => r.path);
  }

  return { uploadedUrls, uploadedPaths };
}
