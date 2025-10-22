import React from 'react';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/inputs/Text';
import FlexBox from '@/app/components/ui/containers/FlexBox';

interface CodeVerificationFormProps {
  email: string;
  otp: string;
  loading: boolean;
  timeLeft: number;
  formatTime: (seconds: number) => string;
  onOtpChange: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onResendCode: () => void;
  onResetFlow: () => void;
}

export default function CodeVerificationForm({
  email,
  otp,
  loading,
  timeLeft,
  formatTime,
  onOtpChange,
  onSubmit,
  onResendCode,
  onResetFlow,
}: CodeVerificationFormProps) {
  return (
    <FlexBox direction="col" align="stretch" gap="md">
      <p className="text-center text-xs">
        código de 6 dígitos enviado a: <span>{email}</span>
      </p>

      <FlexBox gap="md" align="center" justify="center">
        <Button onClick={onResendCode} disabled={loading} variant="secondary">
          Reenviar código
        </Button>
        <Button onClick={onResetFlow} variant="secondary">
          Cambiar correo
        </Button>
      </FlexBox>

      <form onSubmit={onSubmit} className="center flex flex-col">
        <FlexBox direction="col" align="center" gap="md">
          <Input
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => onOtpChange(e.target.value)}
            maxLength={6}
            className="w-full text-center tracking-widest"
            autoFocus
          />
          <div className="text-xs text-gray-500">
            <span>El código expira en: </span>
            <span>{formatTime(timeLeft)}</span>
          </div>
          <Button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="m-auto"
          >
            {loading ? 'verificando...' : 'verificar código'}
          </Button>
        </FlexBox>
      </form>
    </FlexBox>
  );
}
