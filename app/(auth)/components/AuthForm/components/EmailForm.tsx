import React from 'react';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/inputs/Text';
import FlexBox from '@/app/components/ui/containers/FlexBox';

interface EmailFormProps {
  email: string;
  loading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EmailForm({
  email,
  loading,
  onEmailChange,
  onSubmit,
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <FlexBox direction="col" gap="md">
        <p className="text-center text-sm">accede a basket places</p>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !email}>
          {loading ? 'Enviando...' : 'Enviar código de acceso'}
        </Button>
      </FlexBox>
    </form>
  );
}
