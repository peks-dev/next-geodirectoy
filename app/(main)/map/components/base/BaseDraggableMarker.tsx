'use client';

import { Marker } from 'react-leaflet';
import { useRef, useCallback } from 'react';
import type { Marker as LeafletMarker } from 'leaflet';
import type { Coordinates } from '@/comunidad/types';
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
  const markerRef = useRef<LeafletMarker>(null);

  // Crear icono usando el nuevo BaseMarkerIcon que maneja toda la lógica
  const icon = BaseMarkerIcon({ iconColorClass });

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
