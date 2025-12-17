'use client';

import { Marker } from 'react-leaflet';
import BaseMarkerIcon from './BaseMarkerIcon';
import { BaseMarkerProps } from '../../types';

/**
 * Props para el componente BaseMarker
 */

/**
 * Componente base para marcadores sin lógica específica de negocio
 * Maneja solo la presentación básica de un marcador
 */
export default function BaseMarker({
  position,
  iconColorClass,
  children,
  onClick,
}: BaseMarkerProps) {
  // Crear icono usando el nuevo BaseMarkerIcon que maneja toda la lógica
  const icon = BaseMarkerIcon({ iconColorClass });

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      {children}
    </Marker>
  );
}
