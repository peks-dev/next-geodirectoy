'use server';

import { fetchAllCommunitiesForMap } from '../dbQueries';
import { transformToCommunityForMap } from '../transformers';
import { type Result, ok } from '@/lib/types/result';
import { handleServiceError } from '@/lib/errors/handler';
import type { CommunityForMap } from '../types';

export async function getCommunitiesForMap(): Promise<
  Result<CommunityForMap[]>
> {
  try {
    const communities = await fetchAllCommunitiesForMap();

    const communitiesTransformed = communities.map((community) =>
      transformToCommunityForMap(community)
    );

    return ok(communitiesTransformed);
  } catch (error) {
    return handleServiceError(error);
  }
}
