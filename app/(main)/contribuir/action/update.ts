'use server';
import { v4 as uuidv4 } from 'uuid';
import type {
  CommunityFormData,
  CommunityFullResponse,
} from '@/app/types/communityTypes';
import { createClient } from '@/lib/supabase/server';
import { uploadImage, deleteImage } from '@/lib/supabase/storage';
import { getCommunityById } from '@/lib/data/communities';
import { extractStoragePath } from '@/lib/utils/extractStoragePath';
import { type Result, ok, fail } from '@/lib/types/result';
import { handleServiceError } from '@/lib/errors/handler';
import { ErrorCodes } from '@/lib/errors/codes';
import { updateCommunitySchema } from '@/app/(main)/contribuir/schemas/updateCommunitySchema';
import { validateOrThrow } from '@/lib/errors/zodHandler';
import { DatabaseError } from '@/lib/errors/database';

export async function updateCommunity(
  formData: CommunityFormData // TODO: Cambiar a UpdateCommunityFormData cuando se exporte desde types
): Promise<Result<CommunityFullResponse>> {
  const supabase = await createClient();

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

    // 4. Procesar imágenes
    const oldUrls = existingCommunity.images;
    const newFiles = validated.images.filter(
      (img): img is File => img instanceof File
    );
    const keptUrls = validated.images.filter(
      (img): img is string => typeof img === 'string'
    );

    const totalImages = keptUrls.length + newFiles.length;
    if (totalImages < 2 || totalImages > 4) {
      return fail(
        ErrorCodes.BUSINESS_RULE_VIOLATION,
        'Entre 2 y 4 imágenes requeridas'
      );
    }

    // 5. Eliminar imágenes no mantenidas
    const urlsToDelete = oldUrls.filter((url) => !keptUrls.includes(url));
    if (urlsToDelete.length > 0) {
      const pathsToDelete = urlsToDelete.map(extractStoragePath);
      await Promise.all(
        pathsToDelete.map((path) => deleteImage(path, 'COMMUNITIES'))
      );
    }

    // 6. Subir nuevas imágenes
    let uploadedUrls: string[] = [];
    let uploadedPaths: string[] = [];

    if (newFiles.length > 0) {
      const uploadResults = await Promise.all(
        newFiles.map((file) => {
          const fileExtension = file.name.split('.').pop() || 'jpg';
          const fileName = `${uuidv4()}.${fileExtension}`;
          const filePath = `${user.id}/${validated.id}/${fileName}`;

          return uploadImage(file, 'COMMUNITIES', filePath);
        })
      );

      const failed = uploadResults.find((r) => !r.success);
      if (failed) {
        return fail(
          ErrorCodes.STORAGE_ERROR,
          `Error subiendo imagen: ${failed.error}`
        );
      }

      uploadedUrls = uploadResults.map((r) => r.url!);
      uploadedPaths = uploadResults.map((r) => r.path!);
    }

    // 7. Preparar datos para actualización
    const dataToUpdate = {
      type: validated.type,
      name: validated.name,
      description: validated.description,
      country: validated.country,
      state: validated.state,
      city: validated.city,
      floor_type: validated.floor_type,
      is_covered: validated.is_covered,
      schedule: validated.schedule,
      services: validated.services,
      age_group: validated.age_group,
      categories: validated.categories,
      images: [...keptUrls, ...uploadedUrls],
      location: `POINT(${validated.location.lng} ${validated.location.lat})`,
    };

    // 8. Actualizar en base de datos
    const { data: communityUpdated, error: updateError } = await supabase
      .from('communities')
      .update(dataToUpdate)
      .eq('id', validated.id)
      .select()
      .single();

    if (updateError) {
      // Rollback: eliminar imágenes recién subidas
      if (uploadedPaths.length > 0) {
        await Promise.all(
          uploadedPaths.map((path) => deleteImage(path, 'COMMUNITIES'))
        ).catch(console.error);
      }

      throw new DatabaseError(
        `Error actualizando: ${updateError.message}`,
        ErrorCodes.DATABASE_ERROR,
        updateError
      );
    }

    return ok(communityUpdated as CommunityFullResponse);
  } catch (error) {
    return handleServiceError(error);
  }
}
