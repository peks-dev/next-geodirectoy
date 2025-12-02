'use client';

import { Marker } from 'react-leaflet';
import { useMemo, useRef, useCallback } from 'react';
import type { Marker as LeafletMarker } from 'leaflet';
import { createLeafletIcon } from './iconUtils';
import MarkerIcon from './MarkerIcon';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import type { Coordinates } from '@/comunidad/types';

interface DraggableMarkerProps {
  initialPosition?: Coordinates;
  // Cambiamos el nombre de la prop para ser más específicos
  onDragEnd: (coords: Coordinates) => void;
}

export default function DraggableMarker({
  initialPosition = { lat: 20.9674, lng: -89.5926 }, // Mérida, Yucatán
  onDragEnd, // Usamos la nueva prop
}: DraggableMarkerProps) {
  const { isDark } = useAppTheme();
  const markerRef = useRef<LeafletMarker>(null);

  const icon = useMemo(() => {
    const colorClass = isDark ? 'text-accent-primary' : 'text-accent-primary';
    return createLeafletIcon(<MarkerIcon />, colorClass);
  }, [isDark]);

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      // Llamamos a la función pasada por props
      onDragEnd({ lat, lng });
    }
  }, [onDragEnd]);

  return (
    <Marker
      ref={markerRef}
      position={[initialPosition.lat, initialPosition.lng]}
      icon={icon}
      draggable={true}
      eventHandlers={{
        dragend: handleDragEnd,
      }}
    />
  );
}
