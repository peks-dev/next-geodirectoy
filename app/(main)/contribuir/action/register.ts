'use server';
import { v4 as uuidv4 } from 'uuid';
import type { CommunityFormData } from '@/app/types/communityTypes';
import { createClient } from '@/lib/supabase/server';
import { uploadImage, deleteImages } from '@/lib/supabase/storage';
import { extractFileName } from '@/lib/utils/images/extractFileName';

export async function registerCommunity(formData: CommunityFormData): Promise<{
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
    if (!formData.location) {
      throw new Error('Ubicación requerida');
    }

    const communityId = uuidv4();
    const imageFiles = formData.images.filter(
      (img): img is File => img instanceof File
    );

    if (imageFiles.length < 2 || imageFiles.length > 4) {
      throw new Error('Entre 2 y 4 imágenes requeridas');
    }

    // 3. Subir imágenes
    const uploadResults = await Promise.all(
      imageFiles.map((file) =>
        uploadImage(file, 'COMMUNITIES', {
          userId: user.id,
          communityId,
        })
      )
    );

    const failed = uploadResults.find((r) => !r.success);
    if (failed) {
      throw new Error(`Error subiendo imagen: ${failed.error}`);
    }

    const imageUrls = uploadResults.map((r) => r.url!);

    // 4. Preparar datos para inserción
    const { location, ...restData } = formData;

    const dataToInsert = {
      id: communityId,
      user_id: user.id, // Del servidor (seguro), no del cliente
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
      images: imageUrls,
      location: `POINT(${location.lng} ${location.lat})`,
    };

    // 5. Insertar en base de datos
    const { error: insertError } = await supabase
      .from('communities')
      .insert(dataToInsert);

    if (insertError) {
      // Rollback: eliminar imágenes subidas
      const filePaths = imageUrls.map(
        (url) => `${user.id}/${communityId}/${extractFileName(url)}`
      );
      await deleteImages(filePaths, 'COMMUNITIES').catch(console.error);

      throw new Error(`Error al registrar: ${insertError.message}`);
    }

    return {
      success: true,
      message: 'Comunidad registrada correctamente',
    };
  } catch (error) {
    console.error('Error en registerCommunity:', error);

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}
