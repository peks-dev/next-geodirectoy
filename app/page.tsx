import Navbar from '@/components/ui/Navbar';
import { BaseDynamicMap, CommunityMarker } from '@/map/index';
import { fetchAllCommunitiesForMap } from '@/comunidad/dbQueries';
import { transformToCommunityForMap } from '@/comunidad/transformers';

export default async function Home() {
  // Fetch de todas las comunidades desde Supabase
  const communities = await fetchAllCommunitiesForMap();

  // Transformar datos en estructura para cards
  const communitiesTransformed = communities.map((community) =>
    transformToCommunityForMap(community)
  );

  return (
    <div className="relative h-full w-full">
      <BaseDynamicMap>
        {communitiesTransformed.map((community) => (
          <CommunityMarker key={community.id} data={community} />
        ))}
      </BaseDynamicMap>
      <Navbar />
    </div>
  );
}
