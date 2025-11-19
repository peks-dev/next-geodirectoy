// app/(main)/perfil/stores/useProfileStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ProfileStore,
  ProfileDbResponse,
} from '../types/updateProfileTypes';

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : (updates as ProfileDbResponse),
        }));
      },
      clearProfile: () => {
        set({ profile: null });
      },
    }),
    {
      name: 'profile-storage', // nombre en localStorage
      // Solo persiste el perfil, no otros estados si los agregas
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);
