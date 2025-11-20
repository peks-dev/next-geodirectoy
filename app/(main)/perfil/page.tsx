// En el perfil
import { ProtectedWrapper } from '@/app/(auth)/components/ProtectedWrapper';
import LogoutButton from './components/LogoutButton';
import ProfileBanner from './components/ProfileBanner';
import EditProfileBtn from './components/EditProfileBtn';
import DeleteAccountBtn from './components/DeleteAccountBtn';
import OpenMenuBtn from '@/app/components/Menu/OpenMenuBtn';
import NavigationButton from '@/app/components/ui/Buttons/NavigationButton';
import { AddCommunityIcon } from '@/app/components/ui/svgs';
import ProfileCommunities from '../comunidad/components/ProfileCommunities';

export default async function ProfilePage() {
  return (
    <ProtectedWrapper>
      <div className="relative flex h-full w-full flex-col p-4">
        <header className="border-border flex w-full justify-between border-b-2 py-4">
          <ProfileBanner />
          <div className="gap-md flex items-center">
            <DeleteAccountBtn />
            <EditProfileBtn />
            <LogoutButton />
            <OpenMenuBtn variant="primary" />
          </div>
        </header>
        <ProfileCommunities />
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
