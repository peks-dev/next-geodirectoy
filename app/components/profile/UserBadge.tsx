import Image from 'next/image';
import { UserIcon } from '../ui/svgs/';

interface ProfileBadgeProps {
  imageUrl?: string;
  name: string;
}

export default function ProfileBadge({ imageUrl, name }: ProfileBadgeProps) {
  function DefaultUserImage() {
    return (
      <figure className="h-(--icon-small-size) w-(--icon-small-size)">
        <UserIcon />
      </figure>
    );
  }
  return (
    <div className="flex flex-shrink-0 items-center gap-2">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name}'s avatar`}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
      ) : (
        <DefaultUserImage />
      )}

      <span className="text-foreground neon-effect font-heading text-4xl uppercase">
        {name}
      </span>
    </div>
  );
}
