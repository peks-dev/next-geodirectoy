import { getProfileCommunities } from '@/app/(main)/comunidad/action/get-profile-communities';
import { WarningIcon, BackboardIcon } from '@/app/components/ui/svgs';
// Importamos el componente cliente que acabamos de crear
import CommunitiesScrollList from './CommunitiesScrollList'; // Ajusta la ruta según donde lo creaste

export default async function ProfileCommunities() {
  const result = await getProfileCommunities();

  if (!result.success) {
    return (
      <div className="flex grow flex-col items-center justify-center gap-10">
        <figure className="text-foreground neon-effect h-[300px] w-[300px]">
          <WarningIcon />
        </figure>
        <p className="text-error">{result.error.message}</p>
      </div>
    );
  }

  const communities = result.data;

  if (!communities || communities.length === 0) {
    return (
      <div className="flex grow flex-col items-center justify-center gap-10">
        <figure className="text-foreground neon-effect h-[300px] w-[300px]">
          <BackboardIcon />
        </figure>
        <p className="text-foreground text-md text-center">
          No has registrado ninguna comunidad aún.
        </p>
      </div>
    );
  }

  return <CommunitiesScrollList initialItems={communities} />;
}
