import Navbar from './components/ui/Navbar';
import DynamicMap from '@/components/map/DynamicMap';
import { getAllCommunitiesSimple } from '@/lib/data/communities';
import { CommunityForMap } from './types/communityTypes';

/**
 * Página principal con mapa interactivo
 *
 * Muestra todas las comunidades disponibles en el mapa con marcadores clickeables
 * que permiten navegar a la página individual de cada comunidad.
 */
export default async function Home() {
  // Fetch de todas las comunidades desde Supabase
  const communities = await getAllCommunitiesSimple();

  // Transformar datos para el componente Map
  const cardCommunityData: CommunityForMap[] = communities.map((community) => ({
    id: community.id,
    type: community.type,
    name: community.name,
    images: community.images,
    averageRating: community.average_rating,
    ageGroup: community.age_group,
    location: {
      lat: community.lat,
      lng: community.lng,
    },
  }));

  return (
    <div className="relative h-full w-full">
      <DynamicMap communities={cardCommunityData} enablePopups={true} />
      <Navbar />
    </div>
  );
}
