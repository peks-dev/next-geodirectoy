'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import type { MapProps } from './types';

/**
 * Wrapper para cargar el componente Map solo en el cliente
 *
 * react-leaflet requiere window/document, por lo que no puede
 * ejecutarse durante el Server-Side Rendering de Next.js
 */
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-gray-100">
      <p className="text-gray-600">Cargando mapa...</p>
    </div>
  ),
});

// Crear wrapper que acepte children
export default function DynamicMapWrapper({
  children,
  ...props
}: MapProps & { children?: ReactNode }) {
  return <DynamicMap {...props}>{children}</DynamicMap>;
}
