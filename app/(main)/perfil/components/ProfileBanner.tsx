'use client';

import UserAvatar from '@/app/components/ui/UserAvatar';
import type { ProfileDbResponse } from '../types/updateProfileTypes';
import { useEffect } from 'react';
import { useProfileStore } from '../stores/useProfileStore';

export default function ProfileBanner({
  profileData,
}: {
  profileData: ProfileDbResponse;
}) {
  const { profile, updateProfile } = useProfileStore();

  useEffect(() => {
    updateProfile(profileData);
  }, [updateProfile, profileData]);

  return (
    <div className="gap-md flex items-center">
      {profile ? (
        <UserAvatar avatarUrl={profile.avatar_url} />
      ) : (
        <div>..cargando</div>
      )}
      {profile ? <p>{profile.name}</p> : <div>..cargando</div>}
    </div>
  );
}
