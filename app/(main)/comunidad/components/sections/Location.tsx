import type { Coordinates } from '@/comunidad/types';
import { BaseMap, BaseMarker } from '@/app/(main)/map';
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
        <BaseMap center={[location.lat, location.lng]} zoom={13}>
          <BaseMarker position={location} />
        </BaseMap>
      </div>
    </SectionWrapper>
  );
}
