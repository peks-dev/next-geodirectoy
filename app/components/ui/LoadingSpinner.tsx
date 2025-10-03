import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
      <div className="border-foreground-accent h-10 w-10 animate-spin rounded-full border-b-2"></div>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
