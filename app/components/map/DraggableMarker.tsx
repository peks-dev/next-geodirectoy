'use client';

import { Marker } from 'react-leaflet';
import { useMemo, useRef, useCallback } from 'react';
import type { Marker as LeafletMarker } from 'leaflet';
import { createLeafletIcon } from './iconUtils';
import MarkerIcon from './MarkerIcon';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import type { Coordinates } from '@/app/types/communityTypes';

interface DraggableMarkerProps {
  initialPosition?: Coordinates;
  onPositionChange: (coords: Coordinates) => void;
}

// Usado principalmente en el formulario de contribución

export default function DraggableMarker({
  initialPosition = { lat: 20.9674, lng: -89.5926 }, // Mérida, Yucatán
  onPositionChange,
}: DraggableMarkerProps) {
  const { isDark } = useAppTheme();
  const markerRef = useRef<LeafletMarker>(null);

  // Crear icono con color dinámico (diferente a los marcadores normales)
  const icon = useMemo(() => {
    const colorClass = isDark ? 'text-orange-400' : 'text-orange-600';
    return createLeafletIcon(<MarkerIcon />, colorClass);
  }, [isDark]);

  const handleDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker) {
      const { lat, lng } = marker.getLatLng();
      onPositionChange({ lat, lng });
    }
  }, [onPositionChange]);

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
