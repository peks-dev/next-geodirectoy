import { createClient } from '@/lib/supabase/server';
import { fail } from '@/lib/types/result';
import { ErrorCodes } from '@/lib/errors/codes';

export default async function checkExistingReview(
  userId: string,
  communityId: string
) {
  const supabase = await createClient();
  const { data: existingReview, error: existingReviewError } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', userId)
    .eq('community_id', communityId)
    .single();

  if (existingReview) {
    return fail(
      ErrorCodes.REVIEW_ALREADY_EXISTS,
      'Ya has enviado una valoración para esta comunidad.'
    );
  }

  if (existingReviewError && existingReviewError.code !== 'PGRST116') {
    console.error('Error checking for existing review:', existingReviewError);
    return fail(
      ErrorCodes.DATABASE_ERROR,
      'No se pudo verificar si ya has valorado esta comunidad.'
    );
  }
}
