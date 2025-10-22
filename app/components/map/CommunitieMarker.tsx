'use client';

import { Marker, Popup } from 'react-leaflet';
import { useMemo } from 'react';
import { createLeafletIcon } from './iconUtils';
import MarkerIcon from './MarkerIcon';
import { useAppTheme } from '@/lib/hooks/useAppTheme';

import type { CommunityForMap, Coordinates } from '@/app/types/communityTypes';
import CommunityCard from '../community/card';

interface CommunitieMarkerProps {
  location: Coordinates;
  data?: CommunityForMap;
  enablePopup?: boolean;
}

/**
 * Componente individual de marcador de comunidad
 *
 * Renderiza un marcador con icono personalizado que se adapta al tema.
 * Incluye un popup con un botón para navegar a la página individual de la comunidad.
 */
export default function CommunitieMarker({
  location,
  data,
  enablePopup = false,
}: CommunitieMarkerProps) {
  const { isDark } = useAppTheme();

  // Crear icono con color dinámico basado en tema
  const icon = useMemo(() => {
    const colorClass = isDark ? 'text-white-primary' : 'text-dark-primary';
    return createLeafletIcon(<MarkerIcon />, colorClass);
  }, [isDark]);

  return (
    <Marker position={[location.lat, location.lng]} icon={icon}>
      {enablePopup && data && (
        <Popup className="custom-popup">
          <CommunityCard data={data} isPopup />
        </Popup>
      )}
    </Marker>
  );
}
