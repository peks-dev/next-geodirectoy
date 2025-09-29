import { useState } from 'react';
import { toast } from 'sonner';
import { authService } from '@/lib/supabase/authService';
import { useRouter } from 'next/navigation';

type AuthState =
  | 'idle'
  | 'code_sent'
  | 'verifying'
  | 'success'
  | 'error'
  | 'expired';

export const useAuthFlow = () => {
  const [state, setState] = useState<AuthState>('idle');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendOTP = async (isResend = false): Promise<boolean> => {
    setLoading(true);
    const { error } = await authService.sendLoginCode(email);

    if (error) {
      toast.error(error);
      setState('error');
      setLoading(false);
      return false;
    } else {
      if (isResend) {
        toast.success('Se ha reenviado un nuevo código a tu correo.');
      } else {
        toast.success(`Te hemos enviado un código a ${email}`);
      }
      setState('code_sent');
      setLoading(false);
      return true;
    }
  };

  const verifyOTP = async (): Promise<boolean> => {
    setLoading(true);
    const { error } = await authService.verifyEmailOtp(email, otp);

    if (error) {
      toast.error(error);
      setLoading(false);
      return false;
    } else {
      toast.success('¡Bienvenido de nuevo!');
      setState('success');
      authService.getCacheStatus();
      router.push('/perfil');
      setLoading(false);
      return true;
    }
  };

  const resetFlow = () => {
    setState('idle');
    setOtp('');
  };

  const setExpired = () => {
    setState('expired');
  };

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
  };

  const handleOtpChange = (newOtp: string) => {
    setOtp(newOtp.replace(/\D/g, '').slice(0, 6));
  };

  return {
    state,
    email,
    otp,
    loading,
    sendOTP,
    verifyOTP,
    resetFlow,
    setExpired,
    handleEmailChange,
    handleOtpChange,
  };
};
