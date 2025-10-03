'use client';

import DynamicMap from '@/components/map/DynamicMap';
import DynamicDraggableMarker from '@/components/map/DynamicDraggableMarker';
import type { Coordinates } from '@/app/types/communityTypes';
import { useContributionStore } from '../../store/useContributionStore';

const DEFAULT_LOCATION: Coordinates = {
  lat: 20.9674,
  lng: -89.5926,
};

export default function LocationStep() {
  const { location, updateFormField } = useContributionStore();

  const handleLocationChange = (coords: Coordinates) => {
    updateFormField('location', coords);
  };

  const currentPosition = location || DEFAULT_LOCATION;

  return (
    <div className="h-full w-full">
      <DynamicMap center={currentPosition} zoom={11}>
        <DynamicDraggableMarker
          initialPosition={currentPosition}
          onPositionChange={handleLocationChange}
        />
      </DynamicMap>
    </div>
  );
}
