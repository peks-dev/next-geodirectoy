'use client';

import { Marker } from 'react-leaflet';
import { useMemo, useRef, useCallback } from 'react';
import type { Marker as LeafletMarker } from 'leaflet';
import type { Coordinates } from '@/comunidad/types';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import { createLeafletIcon } from '../../utils/iconUtils';
import BaseMarkerIcon from './BaseMarkerIcon';

/**
 * Props para el componente BaseDraggableMarker
 */
export interface BaseDraggableMarkerProps {
  initialPosition?: Coordinates;
  onDragEnd: (coords: Coordinates) => void;
  iconColorClass?: string;
}

/**
 * Componente base para marcadores arrastrables sin lógica específica de negocio
 */
function BaseDraggableMarker({
  initialPosition = { lat: 20.9674, lng: -89.5926 }, // Mérida, Yucatán
  onDragEnd,
  iconColorClass,
}: BaseDraggableMarkerProps) {
  const { isDark } = useAppTheme();
  const markerRef = useRef<LeafletMarker>(null);

  // Usar color por defecto si no se especifica
  const colorClass =
    iconColorClass || (isDark ? 'text-accent-primary' : 'text-accent-primary');

  const icon = useMemo(() => {
    return createLeafletIcon(<BaseMarkerIcon />, colorClass);
  }, [colorClass]);

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

export default BaseDraggableMarker;
