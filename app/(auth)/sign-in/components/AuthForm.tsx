'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { authService } from '@/lib/supabase/authService';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/inputs/Text';
import TransparentContainer from '@/app/components/ui/containers/TransparentContainer';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import HeaderContainer from '@/app/components/ui/Header';

type AuthState =
  | 'idle'
  | 'code_sent'
  | 'verifying'
  | 'success'
  | 'error'
  | 'expired';

export default function AuthForm() {
  const [state, setState] = useState<AuthState>('idle');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, []);

  const sendOTP = async (isResend = false) => {
    setLoading(true);
    const { error } = await authService.sendLoginCode(email);

    if (error) {
      toast.error(error);
      setState('error');
    } else {
      if (isResend) {
        toast.success('Se ha reenviado un nuevo código a tu correo.');
      } else {
        toast.success(`Te hemos enviado un código a ${email}`);
      }
      setState('code_sent');
      setTimeLeft(600);
      startTimer();
    }
    setLoading(false);
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    sendOTP();
  };

  // Tu AuthForm se queda limpio, sin tocar cookies directamente
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const { error } = await authService.verifyEmailOtp(email, otp);

    if (error) {
      toast.error(error);
    } else {
      toast.success('¡Bienvenido de nuevo!');
      setState('success');
      if (timerId.current) clearInterval(timerId.current);

      authService.getCacheStatus();
      // 🎯 El cache ya se estableció automáticamente en authService.verifyEmailOtp()
      router.push('/perfil');
    }
    setLoading(false);
  };

  const startTimer = () => {
    if (timerId.current) clearInterval(timerId.current);
    timerId.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerId.current) clearInterval(timerId.current);
          toast.warning('El código de verificación ha expirado.');
          setState('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetFlow = () => {
    if (timerId.current) clearInterval(timerId.current);
    setState('idle');
    setOtp('');
    setTimeLeft(600);
  };

  const resendCode = () => sendOTP(true);

  return (
    <div className="container-md space-y-6">
      <HeaderContainer>
        <h1 className="heading text-foreground-accent text-neon-accent text-sm">
          {state === 'idle' || state === 'error'
            ? 'inicia sesión o registrate'
            : state === 'code_sent'
              ? 'revisa tu correo'
              : state === 'success'
                ? '¡bienvenido!'
                : 'verificando...'}
        </h1>
      </HeaderContainer>
      <TransparentContainer>
        {(state === 'idle' || state === 'error') && (
          <form onSubmit={handleSendOTP}>
            <FlexBox direction="col" gap="md">
              <p className="text-sm text-center">accede a basket places</p>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <Button type="submit" disabled={loading || !email}>
                {loading ? 'Enviando...' : 'Enviar código de acceso'}
              </Button>
            </FlexBox>
          </form>
        )}

        {state === 'code_sent' && (
          <FlexBox direction="col" align="stretch" gap="md">
            <p className="text-xs text-center">
              código de 6 dígitos enviado a: <span>{email}</span>
            </p>
            <FlexBox gap="md" align="center" justify="center">
              <Button
                onClick={resendCode}
                disabled={loading}
                variant="secondary"
              >
                Reenviar código
              </Button>
              <Button onClick={resetFlow} variant="secondary">
                Cambiar correo
              </Button>
            </FlexBox>
            <form onSubmit={handleVerifyOTP} className="flex flex-col center">
              <FlexBox direction="col" align="center" gap="md">
                <Input
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  maxLength={6}
                  className="w-full tracking-widest text-center"
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
        )}

        {state === 'expired' && (
          <div className="text-center space-y-6">
            <div>
              <p className="text-sm bg-error">El código ha expirado.</p>
            </div>
            <Button onClick={resetFlow}>Solicitar un nuevo código</Button>
          </div>
        )}

        {state === 'success' && (
          <div className="text-center flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground-accent"></div>
            <p className="text-sm ">analizando código...</p>
            {/*<Button onClick={() => (window.location.href = '/')}>
              Explorar canchas
            </Button>*/}
          </div>
        )}

        {state === 'verifying' && (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-foreground-accent"></div>
            {/*<p className="text-sm ">analizando código...</p>*/}
          </div>
        )}
      </TransparentContainer>
    </div>
  );
}
