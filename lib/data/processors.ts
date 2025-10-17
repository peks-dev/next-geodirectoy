// /home/peks/Documents/projects/refactor-bp/geodirectory/lib/transforms/communityTransforms.ts

import type {
  Community,
  CommunityFullResponse,
  CommunityFormData,
  CommunityNearbyResponse,
  NearbyCommunity,
  CommunityMapResponse,
  CommunityForMap,
} from '@/app/types/communityTypes';

// ============================================
// TRANSFORMACIONES DE COMUNIDADES
// ============================================

/**
 * Transforma respuesta RPC completa a tipo Community (para uso general)
 */
export function transformToCommunity(data: CommunityFullResponse): Community {
  return {
    id: data.id,
    type: data.type,
    name: data.name,
    description: data.description,
    location: {
      lat: data.lat,
      lng: data.lng,
    },
    country: data.country,
    state: data.state,
    city: data.city,
    floor_type: data.floor_type,
    is_covered: data.is_covered,
    schedule: data.schedule,
    services: data.services,
    age_group: data.age_group,
    categories: data.categories,
    user_id: data.user_id,
    images: data.images,
    created_at: data.created_at,
    updated_at: data.updated_at,
    average_rating: data.average_rating,
    total_reviews: data.total_reviews,
  };
}

/**
 * Transforma Community a CommunityFormData (para edición en formulario)
 */
export function transformToFormData(community: Community): CommunityFormData {
  return {
    id: community.id,
    type: community.type,
    name: community.name,
    description: community.description,
    location: community.location,
    country: community.country,
    state: community.state,
    city: community.city,
    floor_type: community.floor_type,
    is_covered: community.is_covered,
    schedule: community.schedule,
    services: community.services,
    age_group: community.age_group,
    categories: community.categories,
    user_id: community.user_id,
    images: community.images, // Ya son URLs string[]
  };
}

/**
 * Transforma CommunityFullResponse directamente a CommunityFormData
 */
export function transformResponseToFormData(
  data: CommunityFullResponse
): CommunityFormData {
  return {
    id: data.id,
    type: data.type,
    name: data.name,
    description: data.description,
    location: {
      lat: data.lat,
      lng: data.lng,
    },
    country: data.country,
    state: data.state,
    city: data.city,
    floor_type: data.floor_type,
    is_covered: data.is_covered,
    schedule: data.schedule,
    services: data.services,
    age_group: data.age_group,
    categories: data.categories,
    user_id: data.user_id,
    images: data.images,
  };
}

/**
 * Transforma respuesta nearby a NearbyCommunity
 */
export function transformToNearbyCommunity(
  data: CommunityNearbyResponse
): NearbyCommunity {
  return {
    id: data.id,
    type: data.type,
    name: data.name,
    location: {
      lat: data.lat,
      lng: data.lng,
    },
    city: data.city,
    distance_meters: data.distance_meters,
    average_rating: data.average_rating,
    total_reviews: data.total_reviews,
    images: data.images,
  };
}

/**
 * Transforma respuesta map a CommunityForMap
 */
export function transformToCommunityForMap(
  data: CommunityMapResponse
): CommunityForMap {
  return {
    id: data.id,
    type: data.type,
    name: data.name,
    location: {
      lat: data.lat,
      lng: data.lng,
    },
    city: data.city,
    average_rating: data.average_rating,
    total_reviews: data.total_reviews,
  };
}
