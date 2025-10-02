'use client';

import { Marker } from 'react-leaflet';
import { useMemo } from 'react';
import { createLeafletIcon } from './iconUtils';
import MarkerIcon from './MarkerIcon';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import type { CommunitieLocation } from './types';

interface CommunitieMarkerProps {
  location: CommunitieLocation;
  enablePopup?: boolean;
  onMarkerClick?: (id: string) => Promise<unknown>;
}

/**
 * Componente individual de marcador de cancha
 *
 * Renderiza un marcador con icono personalizado que se adapta al tema.
 * Opcionalmente maneja clicks para mostrar popups.
 */
export default function CommunitieMarker({
  location,
  enablePopup = false,
  onMarkerClick,
}: CommunitieMarkerProps) {
  const { isDark } = useAppTheme();

  // Crear icono con color dinámico basado en tema
  const icon = useMemo(() => {
    const colorClass = isDark ? 'text-blue-400' : 'text-blue-600';
    return createLeafletIcon(<MarkerIcon />, colorClass);
  }, [isDark]);

  const handleClick = async () => {
    if (enablePopup && onMarkerClick) {
      await onMarkerClick(location.id);
    }
  };

  return (
    <Marker
      position={[location.lat, location.lng]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    />
  );
}
