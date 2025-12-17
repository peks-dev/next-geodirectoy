'use client';
import { useCallback } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import { BaseMap } from '@/map/index';
import { useMapStateStore } from '../stores/useMapStateStore';
import { usePanelLoaderStore } from '../stores/usePanelStore';
import type { CommunityForMap } from '../../comunidad/types';
import ClickableMarker from './ClickableMarker';
import PanelLoader from './PanelLoader';

interface HomeMapProps {
  communities: CommunityForMap[];
}

function MapEventHandler() {
  const map = useMap();
  const { setMapPosition } = useMapStateStore();

  const handleMapInteraction = useCallback(() => {
    const center: [number, number] = [map.getCenter().lat, map.getCenter().lng];
    const zoom = map.getZoom();
    setMapPosition(center, zoom);
  }, [map, setMapPosition]);

  useMapEvents({
    moveend: handleMapInteraction,
    zoomend: handleMapInteraction,
  });

  return null;
}

export default function HomeMap({ communities }: HomeMapProps) {
  const { center, zoom } = useMapStateStore();
  const { isLoading } = usePanelLoaderStore();

  return (
    <>
      <BaseMap center={center} zoom={zoom}>
        {communities.map((community) => (
          <ClickableMarker key={community.id} community={community} />
        ))}
        <MapEventHandler />
      </BaseMap>

      {/* Loading global para modales */}
      {isLoading && <PanelLoader />}
    </>
  );
}
