'use client';

import Button from '@/components/ui/Button';
import IconBox from '../ui/IconBox';
import { useGlobalMenuStore } from '@/lib/stores/useGlobalMenuStore';
import { SiteIcon } from '../ui/svgs';

interface Props {
  variant: 'primary' | 'icon';
}

export default function OpenMenuBtn({ variant = 'primary' }: Props) {
  const { openMenu, isMenuOpen } = useGlobalMenuStore();

  return (
    <Button
      variant={variant}
      onClick={openMenu}
      disabled={isMenuOpen}
      size={variant === 'icon' ? 'lg' : undefined}
    >
      {variant === 'primary' ? (
        <span>{isMenuOpen ? 'abierto' : 'menu'}</span>
      ) : (
        <div className="bg-background-interactive rounded-[50%] border-2 p-4">
          <IconBox icon={<SiteIcon />} size="lg" />
        </div>
      )}
    </Button>
  );
}
