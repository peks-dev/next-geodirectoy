import { getIconSizeClass, type IconSize } from '@/lib/utils/getIconSize';

interface Props {
  icon: React.ReactNode;
  size: IconSize;
  className?: string;
}

export default function IconBox({ icon, size, className }: Props) {
  const iconSize = getIconSizeClass(size);

  return <figure className={`${iconSize} ${className}`}>{icon}</figure>;
}
