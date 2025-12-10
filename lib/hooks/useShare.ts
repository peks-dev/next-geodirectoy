'use client';
import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';
import { getErrorMessage } from '@/lib/utils/errorHandler';

// ==================== Constants ====================
const MESSAGES = {
  SUCCESS: {
    COPIED: 'URL copiada al portapapeles',
    SHARED: 'Contenido compartido exitosamente',
  },
  ERROR: {
    SHARE_FAILED: 'No se pudo compartir el contenido',
    CLIPBOARD_FAILED: 'No se pudo copiar al portapapeles',
  },
} as const;

// ==================== Types ====================
interface ShareContent {
  title: string;
  text: string;
}

// ==================== Utilities ====================
const getAbsoluteUrl = (): string => {
  const url = window.location.href;
  return url.startsWith('http')
    ? url
    : `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search}`;
};

const canShare = (data: ShareData): boolean => {
  return navigator.canShare ? navigator.canShare(data) : !!navigator.share;
};

const isUserCancelled = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

const copyToClipboard = async (text: string): Promise<void> => {
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard API no disponible');
  }
  await navigator.clipboard.writeText(text);
};

const shareContent = async ({
  title,
  text,
}: ShareContent): Promise<string | undefined> => {
  const url = getAbsoluteUrl();
  const shareData = { url, title: title || document.title, text: text || '' };

  // Intenta Web Share API (móvil)
  if (canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return MESSAGES.SUCCESS.SHARED;
    } catch (error) {
      if (isUserCancelled(error)) return undefined;
      // Continúa al fallback de clipboard
    }
  }

  // Fallback: copiar al portapapeles
  await copyToClipboard(url);
  return MESSAGES.SUCCESS.COPIED;
};

// ==================== Hook ====================
export function useShare() {
  const handleShare = async (content: ShareContent) => {
    try {
      const message = await shareContent(content);
      if (message) showSuccessToast(message);
    } catch (error) {
      showErrorToast(getErrorMessage(error));
    }
  };

  return { handleShare };
}
