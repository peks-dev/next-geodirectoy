'use client';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useAppTheme } from '@/lib/hooks/useAppTheme';
import CommunitieMarker from './CommunitieMarker';
import type { MapProps } from './types';
import 'leaflet/dist/leaflet.css';
import './leaflet-overrides.css';

export default function Map({
  communities = [],
  enablePopups = false,
  center = { lat: 23.6345, lng: -102.5528 }, // Centro de México por defecto
  zoom = 5, // Zoom país completo por defecto
  children,
  location = null,
}: MapProps) {
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
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Cargando mapa...</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      minZoom={5}
      maxZoom={18}
      className="swiper-no-swiping z-0 h-full w-full"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution={isDark ? darkAttribution : lightAttribution}
        url={isDark ? darkTileUrl : lightTileUrl}
        key={isDark ? 'dark' : 'light'}
      />

      {/* Renderizar marcadores */}
      {communities.map((community) => (
        <CommunitieMarker
          key={community.id}
          location={community.location}
          enablePopup={enablePopups}
          data={{
            id: community.id,
            type: community.type,
            name: community.name,
            images: community.images,
            ageGroup: community.ageGroup,
            averageRating: community.averageRating,
            location: community.location,
          }}
        />
      ))}

      {/* renderizar una ubicacion sencilla */}
      {location ? <CommunitieMarker location={location} /> : null}

      {/* Renderizar DraggableMarker u otros children */}
      {children}
    </MapContainer>
  );
}
