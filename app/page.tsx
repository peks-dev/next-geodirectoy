import Navbar from './components/ui/Navbar';
import DynamicMap from '@/components/map/DynamicMap';
import { getAllCommunitiesSimple } from '@/lib/data/communities';
import { transformToCommunityForMap } from '@/lib/data/processors';

export default async function Home() {
  // Fetch de todas las comunidades desde Supabase
  const communities = await getAllCommunitiesSimple();

  // Transformar datos para el componente Map
  const communityCardData = communities.map((community) =>
    transformToCommunityForMap(community)
  );

  return (
    <div className="relative h-full w-full">
      <DynamicMap communities={communityCardData} enablePopups={true} />
      <Navbar />
    </div>
  );
}
