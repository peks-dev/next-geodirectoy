'use client';

import dynamic from 'next/dynamic';
import MapSkeleton from '@/app/components/ui/skeletons/MapSkeleton';

// Cargar BaseMap dinámicamente
export const BaseDynamicMap = dynamic(() => import('./base/BaseMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

export default BaseDynamicMap;
