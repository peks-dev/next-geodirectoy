'use server';
import { createClient } from '@/lib/supabase/server';
import { ok, fail, type Result } from '@/app/types/result';
import { ErrorCodes } from '@/app/types/errorCodes';
import { Community } from '@/app/types/communityTypes';

export async function deleteCommunityService(
  communityId: string
): Promise<Result<Community>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId)
      .select()
      .single();
    if (error) {
      return fail(
        ErrorCodes.DATABASE_ERROR,
        'no se pudoe eliminar la comunidad de la base de datos'
      );
    }
    return ok(data);
  } catch (error) {
    return fail(
      ErrorCodes.INTERNAL_ERROR,
      'Error inesperado al eliminar al comunidad'
    );
  }
}
