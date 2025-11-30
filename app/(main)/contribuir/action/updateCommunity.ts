'use server';

import type { CommunityFormData, Community } from '@/app/types/communityTypes';
import { createClient } from '@/lib/supabase/server';
import { getCommunityById } from '@/lib/data/communities';
import { type Result, ok, fail } from '@/lib/types/result';
import { handleServiceError } from '@/lib/errors/handler';
import { ErrorCodes } from '@/lib/errors/codes';
import { DatabaseError } from '@/lib/errors/database';
import { updateCommunitySchema } from '@/app/(main)/contribuir/schemas/updateCommunitySchema';
import { validateOrThrow } from '@/lib/errors/zodHandler';
import { separateNewAndExistingImages } from '../utils/imageSplitter';
import * as contributionService from '../services/index';
import { deleteImage } from '@/lib/supabase/storage';
import { transformToCommunityProfile } from '../transformers';

export async function updateCommunity(
  formData: CommunityFormData
): Promise<Result<Community>> {
  const supabase = await createClient();

  // Declarar fuera del try para acceso en catch
  let pathsToRollback: string[] = [];
  try {
    // 1. Validar schema
    const validated = validateOrThrow(updateCommunitySchema, formData);

    // 2. Validar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return fail(ErrorCodes.UNAUTHORIZED, 'No autorizado');
    }

    // 3. Verificar propiedad de la comunidad
    const existingCommunity = await getCommunityById(validated.id);
    if (!existingCommunity) {
      return fail(ErrorCodes.COMMUNITY_NOT_FOUND, 'Comunidad no encontrada');
    }

    if (existingCommunity.user_id !== user.id) {
      return fail(ErrorCodes.FORBIDDEN, 'No autorizado');
    }

    // 4. Separar y validar imágenes
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

    // 5. Análisis AI (solo nuevas imágenes)
    const aiResult = await contributionService.analyzeCommunity({
      name: validated.name,
      description: validated.description,
      images: newFiles,
      floor_type: validated.floor_type,
      is_covered: validated.is_covered,
    });

    // 6. Procesar imágenes (eliminar viejas + subir nuevas)
    const oldUrls = existingCommunity.images;
    const imageResults = await contributionService.uploadCommunityImages(
      oldUrls,
      existingUrls,
      newFiles,
      user.id,
      validated.id
    );

    // Asignar paths para posible rollback
    pathsToRollback = imageResults.uploadedPaths;

    // 7. Actualizar en base de datos
    const updatedCommunity = await contributionService.modifyCommunity(
      validated,
      { ...imageResults, existingUrls },
      aiResult,
      validated.id
    );

    const community = transformToCommunityProfile(updatedCommunity);

    return ok(community);
  } catch (error) {
    // Rollback si error de DB post-upload
    if (pathsToRollback.length > 0 && error instanceof DatabaseError) {
      try {
        await Promise.all(
          pathsToRollback.map((path) => deleteImage(path, 'COMMUNITIES'))
        );
      } catch (rollbackError) {
        // CRÍTICO: Loguear para monitoreo (Sentry, Datadog, etc.)
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
