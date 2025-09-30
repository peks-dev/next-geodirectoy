'use client';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import FlexBox from '@/components/ui/containers/FlexBox';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function Navbar() {
  const route = useRouter();

  function formNavitation() {
    route.push('/contribuir');
  }
  function profileNavigation() {
    route.push('/perfil');
  }
  return (
    <FlexBox direction="col" gap="md" className="absolute top-0 right-0 z-10">
      <Button variant="secondary" onClick={profileNavigation}>
        perfil
      </Button>
      <Button variant="secondary" onClick={formNavitation}>
        contribuir
      </Button>
      <ThemeToggle />
    </FlexBox>
  );
}
