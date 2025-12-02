'use server';

import { fetchCommunityReviews } from '../dbQueries';
import { type Result, ok } from '@/lib/types/result';
import { ReviewDatabase } from '../types';
import { handleServiceError } from '@/lib/errors/handler';

export async function getCommunityReviews(
  communityId: string
): Promise<Result<ReviewDatabase[]>> {
  try {
    const reviews = await fetchCommunityReviews(communityId);

    return ok(reviews);
  } catch (error) {
    return handleServiceError(error);
  }
}
