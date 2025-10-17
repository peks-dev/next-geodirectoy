// Utilidad para extraer path de storage desde URL
export const extractStoragePath = (url: string): string => {
  const startIndex = url.indexOf('community-images/');
  return url.substring(startIndex + 'community-images/'.length);
};
