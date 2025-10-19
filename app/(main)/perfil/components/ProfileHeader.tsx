'use client';
import { LogoutButton } from './LogoutButton';
import { useAuth } from '@/app/components/auth/AuthProvider';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import Button from '@/app/components/ui/Button';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import { useRouter } from 'next/navigation';

export default function ProfileHeader() {
  const { user } = useAuth();
  const router = useRouter();

  function formNavitation() {
    router.push('/contribuir');
  }
  return (
    <header>
      <FlexBox align="center" justify="between">
        <NavigationButton url="/" variant="primary" className="w-min grow-0">
          mapa
        </NavigationButton>
        <Button variant="secondary" onClick={formNavitation}>
          contribuir
        </Button>
        <LogoutButton />
      </FlexBox>
      <p className="grow text-center text-sm">{user?.email}</p>
      <div className="mt-8 border-t pt-8">
        <p>aqui va el listado de las canchas</p>
      </div>
    </header>
  );
}
