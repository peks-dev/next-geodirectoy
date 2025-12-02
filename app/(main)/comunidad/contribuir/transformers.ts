import type {
  Community,
  CommunityFullResponse,
  Coordinates,
} from '@/comunidad/types';

/**
 * Transforma CommunityFullResponse (lat/lng separados) a Community (location: Coordinates)
 * @param response - Respuesta de la base de datos con lat/lng separados
 * @returns Community con estructura location: { lat, lng }
 */
export function transformToCommunityProfile(
  data: CommunityFullResponse
): Community {
  const { lat, lng, ...rest } = data;

  const location: Coordinates = { lat, lng };

  return {
    ...rest,
    location,
  };
}

/**
 * Transforma múltiples CommunityFullResponse a Community[]
 * @param responses - Array de respuestas de la base de datos
 * @returns Array de Community con estructura normalizada
 */
export function transformToCommunitiesProfileArray(
  responses: CommunityFullResponse[]
): Community[] {
  return responses.map(transformToCommunityProfile);
}
