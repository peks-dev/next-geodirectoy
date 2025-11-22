'use server';

import { getCurrentUser } from '@/app/(auth)/services/authService.server';
import { fail, type Result } from '@/app/types/result';
import { ErrorCodes } from '@/app/types/errorCodes';
import { Community } from '@/app/types/communityTypes';
import { deleteCommunityService } from '../services/deleteCommunity.service';

export async function deleteCommunityAction(
  communityId: string
): Promise<Result<Community>> {
  const { data: user, error: authError } = await getCurrentUser();

  if (authError || !user) {
    return fail(ErrorCodes.USER_NOT_FOUND, 'no hay usuario autenticado');
  }

  const result = await deleteCommunityService(communityId);

  return result;
}
