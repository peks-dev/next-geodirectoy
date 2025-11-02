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
  },
  ERROR: {
    SHARE_FAILED: 'No se pudo compartir el contenido',
  },
} as const;

// ==================== Types ====================
interface ShareContent {
  title: string;
  text: string;
  url: string;
}

// ==================== Utilities ====================
async function shareContent({
  title,
  text,
  url,
}: ShareContent): Promise<string | undefined> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return undefined;
    } catch (error) {
      if (isUserCancelledError(error)) {
        return undefined;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return MESSAGES.SUCCESS.COPIED;
  } catch (error) {
    throw new Error(MESSAGES.ERROR.SHARE_FAILED);
  }
}

function isUserCancelledError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

// ==================== Hook ====================
export function useShare() {
  const handleShare = async ({ title, text, url }: ShareContent) => {
    try {
      const successMessage = await shareContent({
        title,
        text,
        url,
      });

      if (successMessage) {
        showSuccessToast(successMessage);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showErrorToast(errorMessage);
    }
  };

  return { handleShare };
}
