'use client';

import UserAvatar from '@/app/components/ui/UserAvatar';
import { useProfileStore } from '../stores/useProfileStore';

export default function ProfileBanner() {
  const { profile } = useProfileStore();

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
