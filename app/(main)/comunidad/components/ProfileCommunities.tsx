import CommunityCard from '@/app/components/community/card';
import { getProfileCommunities } from '@/app/(main)/comunidad/action/getProfileCommunitiesAction';
import { WarningIcon, BackboardIcon } from '@/app/components/ui/svgs';

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

  return (
    <div className="border-border grow overflow-auto border-b-2 pt-10">
      <ul className="flex max-w-full flex-wrap justify-around gap-20">
        {communities.flatMap((community) =>
          Array.from({ length: 12 }).map((_, index) => (
            <li
              key={`${community.id}-${index}`}
              className="w-full max-w-[500px] sm:w-auto"
            >
              <CommunityCard data={community} isPopup={false} />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
