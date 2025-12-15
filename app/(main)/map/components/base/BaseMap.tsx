'use client';

import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import MapSkeleton from '@/app/components/ui/skeletons/MapSkeleton';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import 'leaflet/dist/leaflet.css';
import '../../styles/leaflet-overrides.css';
import type { BaseMapProps } from '@/map/types';

/**
 * Componente base del mapa sin lógica de negocio específica
 * Maneja solo la presentación y configuración básica del mapa
 *
 * Responsabilidades:
 * - Renderizar MapContainer con configuración base
 * - Cargar tiles del mapa (claro/oscuro)
 * - Mostrar controles de zoom
 * - Respetar tamaño del contenedor padre
 * - Renderizar children (marcadores, etc.)
 */
export default function BaseMap({
  center = [23.6345, -102.5528],
  zoom = 5,
  children,
  className = 'h-full w-full z-0 relative swiper-no-swiping',
  minZoom = 5,
  maxZoom = 18,
  scrollWheelZoom = true,
  zoomControl = true,
}: BaseMapProps) {
  const { mounted, isDark } = useAppTheme();

  // Solo renderizar el mapa cuando el tema está listo
  if (!mounted) {
    return <MapSkeleton />;
  }

  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkTileUrl =
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  const lightAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const darkAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      className={`${className} leaflet-container`}
      scrollWheelZoom={scrollWheelZoom}
      zoomControl={false}
      style={{ height: '100%', width: '100%' }}
    >
      {zoomControl && <ZoomControl position="bottomright" />}
      <TileLayer
        attribution={isDark ? darkAttribution : lightAttribution}
        url={isDark ? darkTileUrl : lightTileUrl}
        key={isDark ? 'dark' : 'light'}
        crossOrigin={true}
      />
      {children}
    </MapContainer>
  );
}
