// En el perfil
import { ProtectedWrapper } from '@/app/(auth)/components/ProtectedWrapper';
import LogoutButton from '@/app/(auth)/components/LogoutButton';
import ProfileBanner from './components/ProfileBanner';
import EditProfileBtn from './components/EditProfileBtn';
import DeleteAccountBtn from '@/app/(auth)/components/DeleteAccountBtn';
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
          </div>
        </header>
        <ProfileCommunities />
        <div className="border-accent-primary active:scale:110 absolute right-16 bottom-15 overflow-hidden rounded-[50%] border-2 p-2">
          <NavigationButton
            url="/comunidad/contribuir"
            className="bg-background-interactive rounded-[50%] p-4"
            variant="icon"
            size="md"
          >
            <AddCommunityIcon />
          </NavigationButton>
        </div>
      </div>
    </ProtectedWrapper>
  );
}
