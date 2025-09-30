'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import 'leaflet/dist/leaflet.css';

export default function Map() {
  const { mounted, isDark } = useAppTheme();

  const lightTileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  const darkTileUrl =
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  const lightAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const darkAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[23.6345, -102.5528]}
      zoom={5}
      minZoom={5}
      maxZoom={18}
      className="w-full h-full z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution={isDark ? darkAttribution : lightAttribution}
        url={isDark ? darkTileUrl : lightTileUrl}
        key={isDark ? 'dark' : 'light'}
      />
    </MapContainer>
  );
}
