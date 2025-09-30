'use client';

import dynamic from 'next/dynamic';

/**
 * Wrapper para cargar el componente Map solo en el cliente
 *
 * react-leaflet requiere window/document, por lo que no puede
 * ejecutarse durante el Server-Side Rendering de Next.js
 */
const DynamicMap = dynamic(() => import('./Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Cargando mapa...</p>
    </div>
  ),
});

export default DynamicMap;
