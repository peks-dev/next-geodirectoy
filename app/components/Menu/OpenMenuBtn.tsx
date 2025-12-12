'use client';

import Button from '@/components/ui/Button';
import { useGlobalMenuStore } from '@/lib/stores/useGlobalMenuStore';
import { SiteIcon } from '../ui/svgs';

interface Props {
  variant: 'primary' | 'icon';
}

export default function OpenMenuBtn({ variant = 'primary' }: Props) {
  const { openMenu, isMenuOpen } = useGlobalMenuStore();

  const iconSize = 'lg';

  return (
    <Button
      variant={variant}
      onClick={openMenu}
      disabled={isMenuOpen}
      size={variant === 'icon' ? iconSize : undefined}
    >
      {variant === 'primary' ? <span>menu</span> : <SiteIcon />}
    </Button>
  );
}
