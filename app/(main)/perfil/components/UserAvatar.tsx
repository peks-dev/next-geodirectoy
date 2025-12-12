import Image from 'next/image';
import DefaultUserImage from './DefaultUserImage';
import { getIconSizeClass } from '@/lib/utils/getIconSize';

type IconSize = 'xsm' | 'small' | 'md' | 'lg' | 'xl';

interface UserAvatarProps {
  avatarUrl?: string | null;
  size?: IconSize;
  className?: string;
}

export default function UserAvatar({
  avatarUrl,
  size = 'small',
  className = '',
}: UserAvatarProps) {
  const sizeClass = getIconSizeClass(size);
  if (!avatarUrl) {
    return <DefaultUserImage size={size} />;
  }

  return (
    <div
      className={`relative flex-shrink-0 overflow-hidden rounded-full ${sizeClass} ${className}`}
    >
      <Image
        src={avatarUrl}
        alt="User Avatar"
        layout="fill"
        objectFit="contain"
      />
    </div>
  );
}
