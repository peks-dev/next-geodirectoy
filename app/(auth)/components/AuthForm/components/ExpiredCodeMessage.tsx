import React from 'react';
import Button from '@/app/components/ui/Button';

interface ExpiredCodeMessageProps {
  onResendCode: () => void;
}

export default function ExpiredCodeMessage({
  onResendCode,
}: ExpiredCodeMessageProps) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-sm">ya no es valido el codigo.</p>
      </div>
      <Button onClick={onResendCode}>Solicitar un nuevo código</Button>
    </div>
  );
}
