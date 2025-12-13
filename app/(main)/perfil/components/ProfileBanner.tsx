'use client';

import UserAvatar from '@/app/(main)/perfil/components/UserAvatar';
import { useProfileStore } from '../stores/useProfileStore';
import ProfileBannerSkeleton from '@/app/components/ui/skeletons/ProfileBannerSkeleton';

export default function ProfileBanner() {
  const { profile } = useProfileStore();

  if (!profile) {
    return <ProfileBannerSkeleton />;
  }

  return (
    <div className="gap-md flex items-center">
      <UserAvatar avatarUrl={profile.avatar_url} />
      <p>{profile.name}</p>
    </div>
  );
}
