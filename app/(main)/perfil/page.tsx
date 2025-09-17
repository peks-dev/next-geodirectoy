// En el perfil
import { ProtectedWrapper } from '@/app/components/auth/ProtectedWrapper';
import ProfileHeader from './components/ProfileHeader';

export default function ProfilePage() {
  return (
    <ProtectedWrapper>
      <div className="container mx-auto p-4">
        <ProfileHeader />
      </div>
    </ProtectedWrapper>
  );
}
