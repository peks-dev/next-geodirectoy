'use client';

import { Marker, Popup } from 'react-leaflet';
import MarkerIcon from './MarkerIcon';
import CommunityCard from '../community/card';
import { createLeafletIcon } from './iconUtils';
import { useMemo } from 'react';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import type { CommunityForMap, Coordinates } from '@/comunidad/types';

interface CommunitieMarkerProps {
  location: Coordinates;
  data?: CommunityForMap;
  enablePopup?: boolean;
}

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
          <CommunityCard data={data} />
        </Popup>
      )}
    </Marker>
  );
}
