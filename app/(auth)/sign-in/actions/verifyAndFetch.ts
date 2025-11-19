'use server';

import { verifyOtp } from '../../services/authService.server';
import { fetchProfileById } from '@/app/(main)/perfil/services/profileRepository';

export async function verifyOtpAndFetchProfile(email: string, token: string) {
  // Verifica el OTP
  const { data: authData, error: authError } = await verifyOtp(email, token);

  if (authError || !authData) {
    return { data: null, error: authError };
  }

  // Obtiene el perfil del usuario autenticado
  const { data: profile, error: profileError } = await fetchProfileById(
    authData.user.id
  );

  if (profileError) {
    return { data: null, error: profileError };
  }

  return {
    data: {
      user: authData.user,
      session: authData.session,
      profile,
    },
    error: null,
  };
}
