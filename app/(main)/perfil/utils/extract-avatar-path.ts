/**
 * Extrae el path del archivo desde una URL de avatar
 * @param avatarUrl - URL completa del avatar
 * @returns Path relativo del archivo
 */
export function extractAvatarPath(avatarUrl: string): string {
  return avatarUrl.split('/avatars/')[1];
}
