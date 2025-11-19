// hooks/useAuthFlow.ts
'use client';

import { useState } from 'react';
import {
  showSuccessToast,
  showErrorToast,
} from '@/app/components/toast/notificationService';
import { sendLoginCode } from '../../services/authService.browser';
import { verifyOtpAndFetchProfile } from '../actions/verifyAndFetch';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import { cacheService } from '@/lib/supabase/cacheService';
import { useAuth } from '@/app/(auth)/components/AuthProvider';
import { supabase } from '@/lib/supabase/client';

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
  const searchParams = useSearchParams();
  const { updateProfile: updateProfileStore } = useProfileStore();
  const { waitForAuth } = useAuth();

  const sendOTP = async (isResend = false): Promise<boolean> => {
    setLoading(true);
    const { error } = await sendLoginCode(email);

    if (error) {
      showErrorToast('Error al enviar código', error);
      setState('error');
      setLoading(false);
      return false;
    }

    if (isResend) {
      showSuccessToast(
        'Código reenviado',
        'Se ha reenviado un nuevo código a tu correo.'
      );
    } else {
      showSuccessToast(
        'Código enviado',
        `Te hemos enviado un código a ${email}`
      );
    }
    setState('code_sent');
    setLoading(false);
    return true;
  };

  const verifyOTP = async (): Promise<boolean> => {
    setLoading(true);
    setState('verifying');

    const result = await verifyOtpAndFetchProfile(email, otp);

    if (result.error || !result.data) {
      showErrorToast(
        'Error al verificar código',
        result.error || 'Error al verificar el código'
      );
      setState('error');
      setLoading(false);
      return false;
    }

    // Hidrata el store con el perfil
    if (result.data.profile) {
      updateProfileStore(result.data.profile);
    }

    // Establece el cache
    if (result.data.user) {
      cacheService.setAuthCache({
        id: result.data.user.id,
        email: result.data.user.email!,
      });
    }

    //  Fuerzar a Supabase a refrescar la sesión
    await supabase.auth.refreshSession();

    // Pequeño delay para que el evento se propague
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Ahora espera a que AuthProvider se entere
    await waitForAuth();

    // Determina a dónde navegar
    const returnUrl = searchParams.get('returnUrl');
    let destination = '/perfil';

    if (returnUrl) {
      const decoded = decodeURIComponent(returnUrl);
      if (decoded.startsWith('/') && !decoded.startsWith('//')) {
        destination = decoded;
      }
    }
    // Feedback visual
    showSuccessToast('Bienvenido', '¡Bienvenido de nuevo!');
    setState('success');

    router.push(destination);
    setLoading(false);
    return true;
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
