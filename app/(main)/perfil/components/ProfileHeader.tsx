'use client';
import { LogoutButton } from './LogoutButton';
import { useAuth } from '@/app/components/auth/AuthProvider';
import FlexBox from '@/app/components/ui/containers/FlexBox';
import Button from '@/app/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function ProfileHeader() {
  const { user } = useAuth();
  const router = useRouter();

  const handleMapNavigation = () => {
    router.push('/');
  };
  return (
    <header>
      <FlexBox align="center" justify="between">
        <Button onClick={handleMapNavigation} className="grow-0 w-min">
          mapa
        </Button>
        <p className="grow text-center text-sm">{user?.email}</p>
        <LogoutButton />
      </FlexBox>
      <div className="mt-8 pt-8 border-t">
        <p>aqui va el listado de las canchas</p>
      </div>
    </header>
  );
}
