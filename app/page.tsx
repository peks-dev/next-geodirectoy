import Navbar from './components/ui/Navbar';
import DynamicMap from '@/components/map/DynamicMap';
export default function Home() {
  return (
    <div className="relative h-full w-full">
      <DynamicMap
        locations={[
          { id: '1', lat: 19.4326, lng: -99.1332 }, // CDMX
          { id: '2', lat: 20.9674, lng: -89.5926 }, // Mérida
        ]}
      />
      <Navbar />
    </div>
  );
}
