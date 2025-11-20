'use server';
import { createClient } from '@/lib/supabase/server';
import { Community } from '@/app/types/communityTypes';
import { ok, fail, type Result } from '@/app/types/result';
import { ErrorCodes } from '@/app/types/errorCodes';

export async function fetchProfileCommunities(
  userId: string
): Promise<Result<Community[]>> {
  try {
    const supabase = await createClient();
    const { data: communities, error } = await supabase
      .from('communities')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      return fail(
        ErrorCodes.DATABASE_ERROR,
        'No se pudo hacer fetch a supabase',
        error
      );
    }

    return ok(communities);
  } catch (error) {
    return fail(
      ErrorCodes.INTERNAL_ERROR,
      'Error inesperado al hacer fetch de las comunidades',
      error
    );
  }
}
