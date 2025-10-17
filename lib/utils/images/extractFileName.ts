export const extractFileName = (url: string): string =>
  url.split('/').pop() || '';
