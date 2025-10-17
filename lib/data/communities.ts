import { createClient } from '@/lib/supabase/server';
import type {
  CommunityFullResponse,
  CommunityNearbyResponse,
  CommunityMapResponse,
  PaginatedResponse,
  MapBounds,
} from '@/app/types/communityTypes';

// ============================================
// 1. OBTENER COMUNIDAD POR ID (retorna raw data)
// ============================================

export async function getCommunityById(
  id: string
): Promise<CommunityFullResponse | null> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('get_community_by_id', {
      community_id: id,
    });

    if (error) {
      console.error('Error fetching community by ID:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    return data[0] as CommunityFullResponse;
  } catch (error) {
    console.error('Unexpected error in getCommunityById:', error);
    return null;
  }
}

// ============================================
// 2. OBTENER COMUNIDADES POR CIUDAD (retorna raw data)
// ============================================

export async function getCommunitiesByCity(
  city: string,
  maxResults: number = 100
): Promise<CommunityFullResponse[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('communities_by_city', {
      city_name: city,
      max_results: maxResults,
    });

    if (error) {
      console.error('Error fetching communities by city:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as CommunityFullResponse[];
  } catch (error) {
    console.error('Unexpected error in getCommunitiesByCity:', error);
    return [];
  }
}

// ============================================
// 3. OBTENER COMUNIDADES CERCANAS (retorna raw data)
// ============================================

export async function getNearbyCommunities(
  lat: number,
  lng: number,
  radiusMeters: number = 5000,
  maxResults: number = 50
): Promise<CommunityNearbyResponse[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('nearby_communities', {
      user_lat: lat,
      user_lng: lng,
      radius_meters: radiusMeters,
      max_results: maxResults,
    });

    if (error) {
      console.error('Error fetching nearby communities:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as CommunityNearbyResponse[];
  } catch (error) {
    console.error('Unexpected error in getNearbyCommunities:', error);
    return [];
  }
}

// ============================================
// 4. OBTENER COMUNIDADES EN ÁREA VISIBLE (retorna raw data)
// ============================================

export async function getCommunitiesInView(
  bounds: MapBounds,
  maxResults: number = 100
): Promise<CommunityMapResponse[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.rpc('communities_in_view', {
      min_lat: bounds.minLat,
      min_lng: bounds.minLng,
      max_lat: bounds.maxLat,
      max_lng: bounds.maxLng,
      max_results: maxResults,
    });

    if (error) {
      console.error('Error fetching communities in view:', error.message);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data as CommunityMapResponse[];
  } catch (error) {
    console.error('Unexpected error in getCommunitiesInView:', error);
    return [];
  }
}

// ============================================
// 5. OBTENER TODAS LAS COMUNIDADES (CON PAGINACIÓN)
// ============================================

export async function getAllCommunities(
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedResponse<CommunityFullResponse>> {
  const supabase = await createClient();

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Obtener el total de comunidades
    const { count } = await supabase
      .from('communities')
      .select('*', { count: 'exact', head: true });

    // Obtener las comunidades de la página actual
    const { data, error } = await supabase.rpc('communities_by_city', {
      city_name: '%',
      max_results: pageSize,
    });

    if (error) {
      console.error('Error fetching all communities:', error.message);
      return {
        data: [],
        total: 0,
        page,
        pageSize,
      };
    }

    return {
      data: (data as CommunityFullResponse[]) || [],
      total: count || 0,
      page,
      pageSize,
    };
  } catch (error) {
    console.error('Unexpected error in getAllCommunities:', error);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
    };
  }
}
