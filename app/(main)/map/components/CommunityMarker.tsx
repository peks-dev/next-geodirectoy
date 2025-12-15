'use client';

import { Popup } from 'react-leaflet';
import CardCommunity from '@/comunidad/components/CardCommunity';
import BaseMarker from './base/BaseMarker';
import { CommunityMarkerProps } from '../types';
/**
 * Componente específico para marcadores de comunidades
 *
 * Responsabilidades:
 * - Renderizar un marcador en una ubicación
 * - Mostrar popup con información de la comunidad (si enablePopup=true)
 * - Reutilizar BaseMarker para la presentación del marcador
 * - Manejar la tarjeta de comunidad dentro del popup
 */
export default function CommunityMarker({ data }: CommunityMarkerProps) {
  return (
    <BaseMarker position={data.location}>
      <Popup className="custom-popup">
        <CardCommunity data={data} />
      </Popup>
    </BaseMarker>
  );
}
