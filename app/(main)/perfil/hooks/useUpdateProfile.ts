'use client';

import { useState } from 'react';
import { useEditProfileFormStore } from '../stores/useEditProfileFormStore';
import { useProfileStore } from '../stores/useProfileStore';
import { updateProfileController } from '../actions';
import { compressImage } from '@/lib/utils/images/compressImage';

interface UseUpdateProfileReturn {
  /**
   * Ejecuta la actualización del perfil.
   * Orquesta el flujo desde el formulario hasta el action.
   * @throws Error si falla la actualización
   */
  handleUpdateProfile: () => Promise<void>;

  /** Estado de loading durante el proceso */
  isLoading: boolean;

  /** Progreso del proceso para feedback visual */
  progress: 'idle' | 'compressing' | 'uploading';
}

/**
 * Hook para actualizar el perfil de usuario (MVVM Pattern)
 * Orquesta el flujo de actualización sin lógica de negocio
 */
export function useUpdateProfile(): UseUpdateProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<
    'idle' | 'compressing' | 'uploading'
  >('idle');

  const handleUpdateProfile = async (): Promise<void> => {
    setIsLoading(true);
    setProgress('idle');

    try {
      // 1. Obtener datos crudos del store de formulario
      const { name, avatarFile } = useEditProfileFormStore.getState();
      const { profile, updateProfile: updateLocalProfile } =
        useProfileStore.getState();

      if (!profile) {
        throw new Error('usuario no logeado');
      }

      // 2. Preparar datos básicos
      const actionData = {
        userId: profile.user_id,
        name: name.trim(),
      };

      // 3. Procesar imagen si existe (comprimir)
      let avatar;
      if (avatarFile) {
        setProgress('compressing');
        // Comprimir la imagen
        const compressedFile = await compressImage(avatarFile, {
          maxWidth: 512,
          maxHeight: 512,
          targetSize: 200 * 1024, // 200KB
          quality: 0.85,
        });
        avatar = compressedFile;
      }

      // 4. Preparar datos finales para el action
      const finalActionData = {
        ...actionData,
        avatar,
      };

      setProgress('uploading');

      // 5. Llamar al controller (que valida y procesa todo)
      const result = await updateProfileController(finalActionData);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      // 6. Actualizar el store local si tuvo éxito
      if (result.data) {
        updateLocalProfile(result.data);
      }
    } finally {
      setIsLoading(false);
      setProgress('idle');
    }
  };

  return {
    handleUpdateProfile,
    isLoading,
    progress,
  };
}
