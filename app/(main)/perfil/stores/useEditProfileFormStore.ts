'use client';

import { create } from 'zustand';
// Asumimos que el tipo EditProfileFormState se actualiza para incluir la nueva info
import type { EditProfileFormState } from '../types';
// Importamos la función de utilidad
import { getImageInfo } from '@/lib/utils/images/getImageInfo';

export const useEditProfileFormStore = create<EditProfileFormState>(
  (set, get) => ({
    name: '',
    avatarFile: null,
    avatarPreviewUrl: '',
    avatarInfo: null, // 1. Añadimos el nuevo estado para la info
    setName: (name) => set({ name }),

    // 2. Hacemos la función asíncrona
    setAvatar: async (file) => {
      const { avatarPreviewUrl } = get();
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }

      // Limpiamos el estado previo mientras se carga la nueva imagen
      set({ avatarFile: null, avatarPreviewUrl: '', avatarInfo: null });

      try {
        const imageInfo = await getImageInfo(file);

        // --- Punto ideal para validaciones ---
        if (imageInfo.size > 5 * 1024 * 1024) {
          // Ejemplo: max 5MB
          // Aquí podrías establecer un estado de error en el store
          return;
        }
        // ------------------------------------

        const newUrl = URL.createObjectURL(file);
        // 3. Actualizamos el estado con toda la información
        set({
          avatarFile: file,
          avatarPreviewUrl: newUrl,
          avatarInfo: imageInfo,
        });
      } catch {
        // Manejar el caso en que getImageInfo falle
      }
    },

    clearForm: () => {
      const { avatarPreviewUrl } = get();
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
      set({
        name: '',
        avatarFile: null,
        avatarPreviewUrl: '',
        avatarInfo: null, // 4. Limpiamos también la info de la imagen
      });
    },
  })
);
