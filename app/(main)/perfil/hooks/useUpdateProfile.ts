import { useState } from 'react';
import { ZodError } from 'zod';
import {
  compressImage,
  ImageCompressionError,
} from '@/lib/utils/images/compressImage';
import { fileToBase64 } from '@/lib/utils/images/imagesTransform';
import { useEditProfileFormStore } from '../stores/useEditProfileFormStore';
import { useProfileStore } from '../stores/useProfileStore';
import { updateProfile } from '../actions/updateProfile';
import {
  updateProfileFormSchema,
  updateProfileActionSchema,
  type UpdateProfileActionInput,
} from '../schemas/updateProfileSchema';

interface UpdateProfileHookResult {
  success: boolean;
  message: string;
}

interface UseUpdateProfileReturn {
  /**
   * Prepara los datos para la actualización del perfil.
   * Realiza validación y compresión de imagen en el cliente.
   * Devuelve los datos listos para ser enviados a la Server Action.
   */
  handleUpdateProfile: () => Promise<UpdateProfileHookResult>;
  /** Estado de loading durante el proceso de preparación */
  isLoading: boolean;
  /** Progreso del proceso (útil para UI feedback) */
  progress: 'idle' | 'validating' | 'compressing' | 'uploading' | 'error';
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<
    'idle' | 'validating' | 'compressing' | 'uploading' | 'error'
  >('idle');

  const handleUpdateProfile = async (): Promise<UpdateProfileHookResult> => {
    setIsLoading(true);
    setProgress('validating');

    try {
      // 1. Obtener datos del store de formulario
      const { name, avatarFile } = useEditProfileFormStore.getState();
      const { profile, updateProfile: updateLocalProfile } =
        useProfileStore.getState();

      if (!profile) {
        throw new Error('se necesita un perfil');
      }

      // 2. Validar datos del formulario con Zod
      const validatedForm = updateProfileFormSchema.parse({
        name: name.trim() || undefined,
        avatarFile: avatarFile || undefined,
        userId: profile.user_id,
      });

      if (!profile) {
        throw new Error('Se necesita un perfil de usuario para actualizar.');
      }

      // 3. Preparar objeto base a enviar
      const actionData: UpdateProfileActionInput = {
        userId: profile.user_id,
      };

      if (validatedForm.name && validatedForm.name.length > 0) {
        actionData.name = validatedForm.name;
      }

      // 4. Procesar y agregar avatar si existe
      if (validatedForm.avatarFile) {
        setProgress('compressing');
        try {
          const compressedFile = await compressImage(validatedForm.avatarFile, {
            maxWidth: 512,
            maxHeight: 512,
            targetSize: 200 * 1024,
            quality: 0.85,
          });

          const base64 = await fileToBase64(compressedFile);

          actionData.compressedAvatar = {
            data: base64,
            name: compressedFile.name,
            type: compressedFile.type as
              | 'image/jpeg'
              | 'image/png'
              | 'image/webp',
            size: compressedFile.size,
          };
        } catch (compressionError) {
          if (compressionError instanceof ImageCompressionError) {
            const errorMessages: Record<string, string> = {
              TOO_LARGE: 'La imagen es demasiado grande. Máximo 10MB.',
              LOAD_FAILED: 'No se pudo cargar la imagen. ¿Está corrupta?',
              COMPRESSION_FAILED:
                'Error al procesar la imagen. Intenta con otra.',
              BROWSER_NOT_SUPPORTED: 'Tu navegador no soporta esta función.',
            };
            throw new Error(
              errorMessages[compressionError.code] ||
                'Error al procesar la imagen'
            );
          }
          throw compressionError;
        }
      }

      // 5. Validar datos finales antes de enviarlos al server
      const validatedActionData = updateProfileActionSchema.parse(actionData);

      const result = await updateProfile(validatedActionData, profile);

      if (!result.success || !result.data) {
        throw new Error('no hay datos del usuario');
      }

      // Actualizar la UI
      updateLocalProfile(result.data);

      setProgress('uploading');
      return {
        success: true,
        message: 'se actualizaron los datos',
      };
    } catch (err) {
      if (err instanceof ZodError) {
        return {
          success: false,
          message: err.message || 'datos del formulario inválidos.',
        };
      }

      return {
        success: false,
        message: 'no se pudo actualizar el perfil',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleUpdateProfile,
    isLoading,
    progress,
  };
}
