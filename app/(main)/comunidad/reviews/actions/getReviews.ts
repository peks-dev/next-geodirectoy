'use server';
import { getCommunityReviews } from '../dbQueries';
import type { DbReviewResponse } from '../types';
import type { ActionResponse } from '@/app/types/ActionTypes';

export async function getReviews(
  communityId: string
): Promise<ActionResponse<DbReviewResponse[]>> {
  return getCommunityReviews(communityId);
}
