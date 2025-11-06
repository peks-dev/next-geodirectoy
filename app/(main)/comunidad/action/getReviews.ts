'use server';
import { getCommunityReviews } from '@/lib/data/reviews';
import type { DbReviewResponse } from '@/app/types/reviewTypes';
import type { ActionResponse } from '@/app/types/ActionTypes';

export async function getReviews(
  communityId: string
): Promise<ActionResponse<DbReviewResponse[]>> {
  return getCommunityReviews(communityId);
}
