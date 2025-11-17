import { create } from 'zustand';
import type {
  ProfileStore,
  ProfileDbResponse,
} from '../types/updateProfileTypes';

export const useProfileStore = create<ProfileStore>((set) => ({
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
}));
