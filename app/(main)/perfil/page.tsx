// En el perfil
import { ProtectedWrapper } from '@/app/(auth)/components/ProtectedWrapper';
import LogoutButton from './components/LogoutButton';
import ProfileBanner from './components/ProfileBanner';
import EditProfileBtn from './components/EditProfileBtn';
import DeleteAccountBtn from './components/DeleteAccountBtn';
import OpenMenuBtn from '@/app/components/Menu/OpenMenuBtn';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import { AddCommunityIcon } from '@/app/components/ui/svgs';

export default async function ProfilePage() {
  return (
    <ProtectedWrapper>
      <div className="relative h-full w-full p-4">
        <header className="border-border flex w-full justify-between border-b-2 pb-8">
          <ProfileBanner />
          <div className="gap-md flex items-center">
            <EditProfileBtn />
            <DeleteAccountBtn />
            <LogoutButton />
            <OpenMenuBtn variant="primary" />
          </div>
        </header>
        <NavigationButton
          url="/contribuir"
          className="bg-background-interactive border-accent-primary absolute right-16 bottom-15 rounded-[50%] border-2 p-4"
          variant="icon"
        >
          <AddCommunityIcon />
        </NavigationButton>
      </div>
    </ProtectedWrapper>
  );
}
