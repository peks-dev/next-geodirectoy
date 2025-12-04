import React from 'react';
import Button from '@/app/components/ui/Button';

interface ExpiredCodeMessageProps {
  onResetFlow: () => void;
}

export default function ExpiredCodeMessage({
  onResetFlow,
}: ExpiredCodeMessageProps) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="bg-error text-sm">El código ha expirado.</p>
      </div>
      <Button onClick={onResetFlow}>Solicitar un nuevo código</Button>
    </div>
  );
}
