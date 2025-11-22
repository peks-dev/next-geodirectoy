import { useState } from 'react';
import { useContributionStore } from '../store/useContributionStore';
import { registerCommunity } from '../../../action/register';
import { updateCommunity } from '../../../action/update';
import { compressAndUpdateImages } from '../utils/compressImages';
import { validateFormData } from '../utils/validateForm';
import type { CommunityFormData, Community } from '@/app/types/communityTypes';

interface UseFormSubmissionReturn {
  isLoading: boolean;
  handleSubmit: () => Promise<{
    success: boolean;
    message?: string;
    data: Community | null;
  }>;
}

export function useFormSubmission(): UseFormSubmissionReturn {
  const { getFormData } = useContributionStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const formData: CommunityFormData = { ...getFormData() };

      // 1. Comprimir imágenes (obligatorio por límite de Next.js 2MB)
      const fileImages = formData.images.filter(
        (img): img is File => img instanceof File
      );
      const urlImages = formData.images.filter(
        (img): img is string => typeof img === 'string'
      );

      let finalImages: (File | string)[] = [...urlImages];

      if (fileImages.length > 0) {
        const { compressedImages } = await compressAndUpdateImages({
          ...formData,
          images: fileImages,
        });
        finalImages = [...urlImages, ...compressedImages];
      }

      formData.images = finalImages;

      // 2. Validar con IA y enriquecer datos (shared: register y update lo necesitan)
      const { isCovered, floorType } = await validateFormData(formData);
      formData.floor_type = floorType;
      formData.is_covered = isCovered;

      // 3. Llamar server action correspondiente
      const result = formData.id
        ? await updateCommunity(formData)
        : await registerCommunity(formData);

      if (!result.success) {
        throw new Error(result.message || 'Error del servidor');
      }

      return { success: true, message: result.message, data: result.data };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleSubmit };
}
