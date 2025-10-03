// components/map/DynamicDraggableMarker.tsx
'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type DraggableMarkerType from './DraggableMarker';

/**
 * Wrapper para cargar DraggableMarker solo en el cliente
 * Evita errores de SSR con Leaflet
 */
const DynamicDraggableMarker = dynamic(() => import('./DraggableMarker'), {
  ssr: false,
  loading: () => null, // No mostrar nada mientras carga
});

export default function DynamicDraggableMarkerWrapper(
  props: ComponentProps<typeof DraggableMarkerType>
) {
  return <DynamicDraggableMarker {...props} />;
}
