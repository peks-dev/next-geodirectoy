import { UserIcon } from './svgs';
import { getIconSizeClass } from '@/lib/utils/getIconSize';

type IconSize = 'xsm' | 'small' | 'md' | 'lg' | 'xl';

interface DefaultUserImageProps {
  size?: IconSize;
}

export default function DefaultUserImage({
  size = 'small',
}: DefaultUserImageProps) {
  const sizeClass = getIconSizeClass(size);
  return (
    <figure className={`flex-shrink-0 ${sizeClass}`}>
      <UserIcon />
    </figure>
  );
}
