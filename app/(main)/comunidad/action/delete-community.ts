'use server';

import { getCommunityById, deleteCommunityById } from '../dbQueries';
import { createClient } from '@/lib/supabase/server';
import { type Result, ok, fail } from '@/lib/types/result';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';
import { handleServiceError } from '@/lib/errors/handler';
import type { CommunityFullResponse } from '@/comunidad/types';

export async function deleteCommunity(
  communityId: string
): Promise<Result<CommunityFullResponse>> {
  try {
    const supabase = await createClient();

    // 1. Comprobar que hay un usuario loggeado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail(
        AuthErrorCodes.UNAUTHORIZED,
        'Debes iniciar sesión para eliminar una comunidad.'
      );
    }

    // 2. Obtener la comunidad para validar ownership
    const community = await getCommunityById(communityId);

    if (!community) {
      return fail(ErrorCodes.NOT_FOUND, 'Comunidad no encontrada.');
    }

    // 3. Verificar que el usuario es el owner de la comunidad
    if (community.user_id !== user.id) {
      return fail(
        ErrorCodes.FORBIDDEN,
        'No tienes permisos para eliminar esta comunidad.'
      );
    }

    // 4. Eliminar la comunidad
    await deleteCommunityById(communityId);

    return ok(community);
  } catch (error) {
    return handleServiceError(error);
  }
}
