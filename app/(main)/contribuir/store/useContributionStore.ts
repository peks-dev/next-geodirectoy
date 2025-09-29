import { create } from 'zustand';
import type { communityData } from '@/app/types/communityTypes';

const INITIAL_FORM_STATE: communityData = {
  type: null,
  name: '',
  description: '',
  location: null,
  images: [],
  floor_type: null,
  is_covered: false,
  schedule: [],
  services: {
    transport: false,
    store: false,
    wifi: false,
    bathroom: false,
  },
  age_group: null,
  categories: null,
};

const MAX_IMAGES = 4;
interface ContributionStore extends communityData {
  updateFormField: <K extends keyof communityData>(
    field: K,
    value: communityData[K]
  ) => void;
  reset: () => void;
  // funciones para las imagenes
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  removeSchedule: (index: number) => void; // Nueva función
}

// Hook to use in steps
export const useContributionStore = create<ContributionStore>((set) => ({
  ...INITIAL_FORM_STATE,

  updateFormField: (field, value) =>
    set((state) => ({ ...state, [field]: value })),

  reset: () => set(INITIAL_FORM_STATE),
  addImages: (files) =>
    set((state) => {
      const filteredFiles = files.filter(
        (file) =>
          file.type.startsWith('image/') &&
          !state.images.some(
            (img) => img instanceof File && img.name === file.name
          )
      );
      const newImages = [...state.images, ...filteredFiles].slice(
        0,
        MAX_IMAGES
      );
      return { images: newImages };
    }),

  removeImage: (index) =>
    set((state) => ({
      images: state.images.filter((_, i) => i !== index),
    })),
  removeSchedule: (index) =>
    set((state) => ({
      schedule: state.schedule.filter((_, i) => i !== index),
    })),
}));
