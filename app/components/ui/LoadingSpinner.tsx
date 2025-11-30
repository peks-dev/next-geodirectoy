import React from 'react';
import { getIconSizeClass, type IconSize } from '@/lib/utils/getIconSize';

interface LoadingSpinnerProps {
  message?: string;
  size?: IconSize;
}

export default function LoadingSpinner({
  message,
  size = 'md',
}: LoadingSpinnerProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 text-center">
      <div
        className={`border-foreground-accent ${getIconSizeClass(size)} animate-spin rounded-full border-b-2`}
      ></div>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
