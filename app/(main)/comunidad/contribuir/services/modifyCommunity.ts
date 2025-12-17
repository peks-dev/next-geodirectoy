import type { CommunityFullResponse } from '@/comunidad/types';
import type { CourtImageAnalysisResult } from '@/contribuir/services/analyzeCommunity/types';
import { UpdateCommunityFormData } from '../schemas/updateCommunitySchema';
import { updateCommunityById } from '@/app/(main)/comunidad/dbQueries';
import { CommunityUpdateData } from '@/comunidad/types';
import type { LocationData } from '@/app/(main)/map/services/reverseGeocode';

/**
 * Servicio para actualizar comunidad en base de datos
 * - Prepara dataToUpdate con AI results y image processing
 * - Llama a updateCommunityQuery
 * - Maneja rollback de imágenes si falla
 */
export async function modifyCommunity(
  validatedData: UpdateCommunityFormData,
  imageResults: {
    uploadedUrls: string[];
    uploadedPaths: string[];
    existingUrls: string[]; // Imágenes que usuario mantiene
  },
  aiResult: CourtImageAnalysisResult,
  communityId: string,
  locationData: LocationData
): Promise<CommunityFullResponse> {
  // Validar que tengamos los datos de ubicación requeridos
  if (!locationData.city || !locationData.country) {
    throw new Error(
      'No se pudo determinar la ubicación completa de las coordenadas proporcionadas'
    );
  }

  const dataToUpdate: CommunityUpdateData = {
    type: validatedData.type,
    name: validatedData.name,
    description: validatedData.description,
    country: locationData.country,
    state: locationData.state,
    city: locationData.city,
    floor_type: aiResult.floorType,
    is_covered: aiResult.isCovered,
    schedule: validatedData.schedule,
    services: validatedData.services,
    age_group: validatedData.age_group,
    categories: validatedData.categories,
    images: [...imageResults.existingUrls, ...imageResults.uploadedUrls],
    location: `POINT(${validatedData.location.lng} ${validatedData.location.lat})`,
  };

  const communityUpdated = await updateCommunityById(dataToUpdate, communityId);

  return communityUpdated;
}
