'use client';

import { Marker } from 'react-leaflet';
import { useMemo } from 'react';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import { createLeafletIcon } from '../../utils/iconUtils';
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
}: BaseMarkerProps) {
  const { isDark } = useAppTheme();

  // Usar color por defecto si no se especifica
  const colorClass =
    iconColorClass || (isDark ? 'text-white-primary' : 'text-dark-primary');

  // Crear icono con color dinámico basado en tema
  const icon = useMemo(() => {
    return createLeafletIcon(<BaseMarkerIcon />, colorClass);
  }, [colorClass]);

  return (
    <Marker position={[position.lat, position.lng]} icon={icon}>
      {children}
    </Marker>
  );
}
