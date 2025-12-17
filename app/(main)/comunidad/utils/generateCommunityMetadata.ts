import type { Metadata } from 'next';
import type { CommunityFullResponse } from '@/comunidad/types';

/**
 * Genera metadata SEO optimizada para páginas de comunidad
 * Reutilizable en página principal y panel/modal
 */
export async function generateCommunityMetadata(
  community: CommunityFullResponse | null
): Promise<Metadata> {
  if (!community) {
    return {
      title: 'Comunidad no encontrada - Basket Places',
      description: 'La comunidad que buscas no existe',
    };
  }

  // Título optimizado con ubicación
  const title = `${community.name} - Comunidad en ${community.city} | Basket Places`;

  // Descripción optimizada (máximo 160 caracteres)
  const description =
    community.description.length > 160
      ? community.description.substring(0, 157) + '...'
      : community.description;

  // URL canónica (siempre apunta a página principal)
  const canonicalUrl = `https://www.basket-places.website/comunidad/${community.id}`;

  // Imagen para compartir (usar la primera imagen)
  const ogImage = community.images[0];

  return {
    title,
    description,
    keywords: [
      'basketball',
      'comunidad',
      'deportivo',
      community.city,
      community.type,
      'basket places',
    ].filter(Boolean),

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Basket Places',
      locale: 'es_ES',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Imagen de ${community.name} en ${community.city}`,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },

    alternates: {
      canonical: canonicalUrl,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}
