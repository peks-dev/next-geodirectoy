'use client';
import Button from '../Button';
import { useRouter } from 'next/navigation';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'delete' | 'icon';
type ButtonSize = 'default' | 'sm' | 'xsm' | 'lg' | 'xl';

interface NavigationButtonProps {
  url: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
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
  const router = useRouter();

  return (
    <Button
      onClick={() => router.push(url)}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </Button>
  );
}
