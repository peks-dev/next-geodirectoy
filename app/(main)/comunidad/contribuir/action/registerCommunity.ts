'use server';

import type { CommunityFormData, Community } from '@/comunidad/types';
import { getCurrentUser } from '@/app/(auth)/database/dbQueries.server';
import { v4 as uuidv4 } from 'uuid';
import { type Result, ok, fail } from '@/lib/types/result';
import { handleServiceError } from '@/lib/errors/handler';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';
import { DatabaseError } from '@/lib/errors/database';
import { registerCommunitySchema } from '../schemas/registerCommunitySchema';
import { validateOrThrow } from '@/lib/errors/zodHandler';
import { separateNewAndExistingImages } from '../utils/imageSplitter';
import * as contributionService from '../services/index';
import { deleteImage } from '@/lib/supabase/storage';
import { transformToCommunityProfile } from '../transformers';
import { reverseGeocode } from '@/app/(main)/map/services/reverseGeocode';

export async function registerCommunity(
  formData: CommunityFormData
): Promise<Result<Community>> {
  let pathsToRollback: string[] = [];
  try {
    // 1. Validar schema
    const validated = validateOrThrow(registerCommunitySchema, formData);

    // 2. Validar autenticación
    const user = await getCurrentUser();

    if (!user) {
      return fail(AuthErrorCodes.UNAUTHORIZED, 'No autorizado');
    }

    // 3. Generar ID único
    const communityId = uuidv4();

    // 4. Obtener información de ubicación usando reverse geocoding
    const locationData = await reverseGeocode(
      validated.location.lat,
      validated.location.lng
    );

    // 5. Separar y validar imágenes (solo nuevas para register)
    const { newFiles, existingUrls } = separateNewAndExistingImages(
      validated.images
    );
    const totalImages = existingUrls.length + newFiles.length;

    if (totalImages < 2 || totalImages > 4) {
      return fail(
        ErrorCodes.BUSINESS_RULE_VIOLATION,
        'Entre 2 y 4 imágenes requeridas'
      );
    }

    // 6. Análisis AI
    const aiResult = await contributionService.analyzeCommunity({
      name: validated.name,
      description: validated.description,
      images: newFiles,
      floor_type: validated.floor_type!,
      is_covered: validated.is_covered!,
    });

    // 7. Procesar imágenes (no hay oldUrls en register)
    const imageResults = await contributionService.uploadCommunityImages(
      [], // No hay imágenes existentes
      existingUrls,
      newFiles,
      user.id,
      communityId
    );

    // Asignar paths para posible rollback
    pathsToRollback = imageResults.uploadedPaths;

    // 8. Crear en base de datos
    const createdCommunity = await contributionService.createCommunity(
      validated,
      imageResults,
      aiResult,
      user.id,
      communityId,
      locationData
    );

    const community = transformToCommunityProfile(createdCommunity);

    return ok(community);
  } catch (error) {
    // Rollback si error de DB post-upload
    if (pathsToRollback.length > 0 && error instanceof DatabaseError) {
      try {
        await Promise.all(
          pathsToRollback.map((path) => deleteImage(path, 'COMMUNITIES'))
        );
      } catch (rollbackError) {
        console.error('✗ ROLLBACK FALLÓ - Imágenes huérfanas:', {
          paths: pathsToRollback,
          originalError: error,
          rollbackError,
        });
      }
    }
    return handleServiceError(error);
  }
}
