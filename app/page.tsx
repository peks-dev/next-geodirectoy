import Navbar from './components/ui/Navbar';
import DynamicMap from '@/components/map/DynamicMap';
import { getAllCommunitiesSimple } from '@/lib/data/communities';
import type { CommunitieLocation } from '@/components/map/types';

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
  const locations: CommunitieLocation[] = communities.map((community) => ({
    id: community.id,
    lat: community.lat,
    lng: community.lng,
  }));

  return (
    <div className="relative h-full w-full">
      <DynamicMap locations={locations} enablePopups={true} />
      <Navbar />
    </div>
  );
}
