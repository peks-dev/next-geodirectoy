import { renderToStaticMarkup } from 'react-dom/server'
import { DivIcon } from 'leaflet'
import type { ReactElement } from 'react'

// Convierte un componente React SVG a un icono de Leaflet

export function createLeafletIcon(
  icon: ReactElement,
  className: string = ''
): DivIcon {
  const iconHtml = renderToStaticMarkup(icon)

  return new DivIcon({
    html: iconHtml,
    className: `custom-leaflet-icon ${className}`,
    iconSize: [40, 52], // Ancho x Alto del icono
    iconAnchor: [20, 52], // Punto de anclaje (centro inferior)
    popupAnchor: [0, -52], // Dónde aparece el popup relativo al icono
  })
}
