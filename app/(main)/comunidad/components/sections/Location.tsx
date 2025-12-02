import type { Coordinates } from '@/comunidad/types';
import DynamicMap from '@/components/map/DynamicMap';
import HeadingSection from '../HeadingSection';
import OpenInMaps from '../OpenInMaps';
import SectionWrapper from './SectionWrapper';

export default function LocationSection({
  location,
}: {
  location: Coordinates;
}) {
  return (
    <SectionWrapper>
      <HeadingSection text="ubicacion" />
      <div className="relative h-full w-full grow">
        <OpenInMaps lat={location.lat} lng={location.lng} />
        <DynamicMap
          location={location}
          center={location}
          zoom={13}
        ></DynamicMap>
      </div>
    </SectionWrapper>
  );
}
