import type {
  CommunityFullResponse,
  CommunityInsertData,
} from '@/comunidad/types';
import type { CourtImageAnalysisResult } from './analyzeCommunity/types';
import { RegisterCommunityFormData } from '../schemas/registerCommunitySchema';
import { insertCommunity } from '@/app/(main)/comunidad/dbQueries';
import type { LocationData } from '@/app/(main)/map/services/reverseGeocode';

export async function createCommunity(
  validatedData: RegisterCommunityFormData,
  imageResults: {
    uploadedUrls: string[];
    uploadedPaths: string[];
  },
  aiResult: CourtImageAnalysisResult,
  userId: string,
  communityId: string,
  locationData: LocationData
): Promise<CommunityFullResponse> {
  // Validar que tengamos los datos de ubicación requeridos
  if (!locationData.city || !locationData.country) {
    throw new Error(
      'No se pudo determinar la ubicación completa de las coordenadas proporcionadas'
    );
  }

  // Crear objeto
  const dataToInsert: CommunityInsertData = {
    id: communityId,
    user_id: userId,
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
    images: imageResults.uploadedUrls,
    location: `POINT(${validatedData.location.lng} ${validatedData.location.lat})`,
  };

  // The type CommunityUpdateData is missing user_id, so we cast to make the call.
  const communityCreated = await insertCommunity(dataToInsert);

  return communityCreated;
}
