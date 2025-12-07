'use server';

import { getCommunitiesByUserId } from '../dbQueries';
import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';
import type { Community } from '@/comunidad/types';

export async function getProfileCommunities(): Promise<Result<Community[]>> {
  try {
    // 1. Comprobar que hay un usuario loggeado
    const user = await getCurrentUser();

    if (!user) {
      return fail(
        AuthErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para ver tus comunidades.'
      );
    }

    // 2. Obtener las comunidades del usuario
    const communities = await getCommunitiesByUserId(user.id);

    return ok(communities);
  } catch (error) {
    return handleServiceError(error);
  }
}
