'use server';

import { verifyOtp } from '@/app/(auth)/database/dbQueries.server';
import { fetchProfileById } from '@/app/(main)/perfil/dbQueries';
import { handleServiceError } from '@/lib/errors/handler';
import { ok } from '@/lib/types/result';

export async function verifyOtpAndFetchProfile(email: string, token: string) {
  try {
    // Verifica el OTP
    const authData = await verifyOtp(email, token);

    // Obtiene el perfil del usuario autenticado
    const profile = await fetchProfileById(authData.user.id);

    return ok({
      user: authData.user,
      session: authData.session,
      profile,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
