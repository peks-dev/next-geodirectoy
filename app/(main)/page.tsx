import HomeMap from '@/app/(main)/map/components/HomeMap';
import { getCommunitiesForMap } from '@/comunidad/action/get-communities-for-map';
import type { Result } from '@/lib/types/result';
import type { CommunityForMap } from '@/comunidad/types';

export default async function Home() {
  const communitiesResult: Result<CommunityForMap[]> =
    await getCommunitiesForMap();

  if (!communitiesResult.success) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <div className="p-4 text-center">
          <p className="font-medium text-red-500">
            Error al cargar las comunidades
          </p>
          <p className="mt-2 text-gray-600">
            {communitiesResult.error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <HomeMap communities={communitiesResult.data} />
    </div>
  );
}
