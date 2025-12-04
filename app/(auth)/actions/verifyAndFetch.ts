'use server';

import { verifyOtp } from '@/app/(auth)/database/dbQueries.server';
import { fetchProfileById } from '@/app/(main)/perfil/services/profileRepository';
import { handleServiceError } from '@/lib/errors/handler';
import { ok, fail } from '@/lib/types/result';
import { ErrorCodes } from '@/lib/errors/codes';

export async function verifyOtpAndFetchProfile(email: string, token: string) {
  try {
    // Verifica el OTP
    const authData = await verifyOtp(email, token);

    // Obtiene el perfil del usuario autenticado
    const { data: profile, error: profileError } = await fetchProfileById(
      authData.user.id
    );

    if (profileError) {
      return fail(ErrorCodes.DATABASE_ERROR, profileError);
    }

    return ok({
      user: authData.user,
      session: authData.session,
      profile,
    });
  } catch (error) {
    return handleServiceError(error);
  }
}
