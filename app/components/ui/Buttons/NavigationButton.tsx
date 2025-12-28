'use client';
import Button from '../Button';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';
import { IconSize } from '@/lib/utils/getIconSize';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'delete' | 'icon';

interface NavigationButtonProps {
  url: string;
  variant?: ButtonVariant;
  size?: IconSize;
  children?: React.ReactNode;
  className?: string;
}

export default function NavigationButton({
  url,
  variant = 'primary',
  size,
  children,
  className,
}: NavigationButtonProps) {
  const { navigate } = useCustomNavigation();

  return (
    <Button
      onClick={() => navigate(url)}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
