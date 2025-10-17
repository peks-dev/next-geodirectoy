'use server';
import type { CommunityFormData } from '@/app/types/communityTypes';
import { createClient } from '@/lib/supabase/server';
import { uploadImage, deleteImages } from '@/lib/supabase/storage';
import { getCommunityById } from '@/lib/data/communities';
import { extractStoragePath } from '@/lib/utils/extractStoragePath';

export async function updateCommunity(formData: CommunityFormData): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  try {
    // 1. Validar autenticación (ÚNICA validación confiable)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('No autorizado');
    }

    // 2. Validaciones básicas
    if (!formData.id || !formData.location) {
      throw new Error('Datos incompletos');
    }

    // 3. Verificar propiedad de la comunidad
    const existingCommunity = await getCommunityById(formData.id);

    if (!existingCommunity) {
      throw new Error('Comunidad no encontrada');
    }

    if (existingCommunity.user_id !== user.id) {
      throw new Error('No autorizado');
    }

    // 4. Procesar imágenes
    const oldUrls = existingCommunity.images;
    const newFiles = formData.images.filter(
      (img): img is File => img instanceof File
    );
    const keptUrls = formData.images.filter(
      (img): img is string => typeof img === 'string'
    );

    const totalImages = keptUrls.length + newFiles.length;
    if (totalImages < 2 || totalImages > 4) {
      throw new Error('Entre 2 y 4 imágenes requeridas');
    }

    // 5. Eliminar imágenes no mantenidas
    const urlsToDelete = oldUrls.filter((url) => !keptUrls.includes(url));

    if (urlsToDelete.length > 0) {
      const pathsToDelete = urlsToDelete.map(extractStoragePath);
      await deleteImages(pathsToDelete, 'COMMUNITIES');
    }

    // 6. Subir nuevas imágenes
    let uploadedUrls: string[] = [];

    if (newFiles.length > 0) {
      const uploadResults = await Promise.all(
        newFiles.map((file) =>
          uploadImage(file, 'COMMUNITIES', {
            userId: user.id,
            communityId: formData.id!,
          })
        )
      );

      const failed = uploadResults.find((r) => !r.success);
      if (failed) {
        throw new Error(`Error subiendo imagen: ${failed.error}`);
      }

      uploadedUrls = uploadResults.map((r) => r.url!);
    }

    // 7. Preparar datos para actualización
    const { location, ...restData } = formData;

    const dataToUpdate = {
      type: restData.type,
      name: restData.name,
      description: restData.description,
      country: restData.country,
      state: restData.state,
      city: restData.city,
      floor_type: restData.floor_type,
      is_covered: restData.is_covered,
      schedule: restData.schedule,
      services: restData.services,
      age_group: restData.age_group,
      categories: restData.categories,
      images: [...keptUrls, ...uploadedUrls],
      location: `POINT(${location.lng} ${location.lat})`,
    };

    // 8. Actualizar en base de datos
    const { error: updateError } = await supabase
      .from('communities')
      .update(dataToUpdate)
      .eq('id', formData.id);

    if (updateError) {
      // Rollback: eliminar imágenes recién subidas
      if (uploadedUrls.length > 0) {
        const rollbackPaths = uploadedUrls.map(extractStoragePath);
        await deleteImages(rollbackPaths, 'COMMUNITIES').catch(console.error);
      }

      throw new Error(`Error actualizando: ${updateError.message}`);
    }

    return {
      success: true,
      message: 'Comunidad actualizada correctamente',
    };
  } catch (error) {
    console.error('Error en updateCommunity:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
