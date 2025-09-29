import React from 'react';
import Button from '@/app/components/ui/Button';

interface ExpiredCodeMessageProps {
  onResetFlow: () => void;
}

export default function ExpiredCodeMessage({
  onResetFlow,
}: ExpiredCodeMessageProps) {
  return (
    <div className="text-center space-y-6">
      <div>
        <p className="text-sm bg-error">El código ha expirado.</p>
      </div>
      <Button onClick={onResetFlow}>Solicitar un nuevo código</Button>
    </div>
  );
}
