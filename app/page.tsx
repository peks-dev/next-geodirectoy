import Navbar from './components/ui/Navbar';
import DynamicMap from '@/components/map/DynamicMap';
export default function Home() {
  return (
    <div className="relative h-full w-full ">
      <DynamicMap />
      <Navbar />
    </div>
  );
}
