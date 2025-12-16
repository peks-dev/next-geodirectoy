'use client';

import { useCallback, useRef } from 'react';
import { useMapEvents, useMap } from 'react-leaflet';
import { BaseMap } from '@/map/index';
import { useMapStateStore } from '../stores/useMapStateStore';
import type { CommunityForMap } from '../../comunidad/types';
import { CommunityMarker } from '@/map/index';

interface HomeMapProps {
  communities: CommunityForMap[];
}

/**
 * Componente interno que maneja los eventos del mapa
 * Debe estar dentro del MapContainer para funcionar correctamente
 */
function MapEventHandler() {
  const map = useMap();
  const { setMapPosition } = useMapStateStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handler para eventos de mapa con debounce
  const handleMapInteraction = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (map) {
        const newCenter: [number, number] = [
          map.getCenter().lat,
          map.getCenter().lng,
        ];
        const newZoom: number = map.getZoom();
        setMapPosition(newCenter, newZoom);
      }
    }, 500); // 500ms debounce
  }, [map, setMapPosition]);

  useMapEvents({
    moveend: handleMapInteraction,
    zoomend: handleMapInteraction,
  });

  return null; // Este componente no renderiza nada
}

/**
 * Componente wrapper para el mapa del home page con persistencia de posición
 * Solo se usa en la página principal para mantener la posición y zoom durante navegación
 */
export default function HomeMap({ communities }: HomeMapProps) {
  const { center, zoom } = useMapStateStore();

  return (
    <BaseMap center={center} zoom={zoom}>
      {communities.map((community) => (
        <CommunityMarker key={community.id} data={community} />
      ))}
      <MapEventHandler />
    </BaseMap>
  );
}
