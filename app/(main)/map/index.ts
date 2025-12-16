'use client';
import dynamic from 'next/dynamic';

// Componentes con dynamic import (todos los que usan react-leaflet)
export const BaseMap = dynamic(() => import('./components/base/BaseMap'), {
  ssr: false,
});

export const BaseMarker = dynamic(
  () => import('./components/base/BaseMarker'),
  {
    ssr: false,
  }
);

export const BaseDraggableMarker = dynamic(
  () => import('./components/base/BaseDraggableMarker'),
  {
    ssr: false,
  }
);

export const CommunityMarker = dynamic(
  () => import('./components/CommunityMarker'),
  {
    ssr: false,
  }
);

// Hooks
export { useGeocoding } from './hooks/useGeocoding';

// Tipos
export type { MapProps } from './types';
