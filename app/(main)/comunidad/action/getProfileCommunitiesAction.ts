'use server';

import { fetchProfileCommunities } from '../services/fetchProfileCommunities';
import { getCurrentUser } from '@/app/(auth)/services/authService.server';
import { fail, type Result } from '@/app/types/result';
import { ErrorCodes } from '@/app/types/errorCodes';
import { Community } from '@/app/types/communityTypes';

export async function getProfileCommunities(): Promise<Result<Community[]>> {
  const { data: user, error: authError } = await getCurrentUser();

  if (authError || !user) {
    return fail(ErrorCodes.USER_NOT_FOUND, 'no hay usuario autenticado');
  }

  const result = await fetchProfileCommunities(user.id);

  return result;
}
