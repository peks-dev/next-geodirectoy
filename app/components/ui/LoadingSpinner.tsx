import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className="text-center flex flex-col items-center justify-center space-y-4 py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground-accent"></div>
      {message && <p className="text-sm">{message}</p>}
    </div>
  );
}
