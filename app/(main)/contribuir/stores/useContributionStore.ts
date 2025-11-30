import { create } from 'zustand';
import type {
  CommunityFormData,
  CommunityType,
} from '@/app/types/communityTypes';

const INITIAL_FORM_STATE: CommunityFormData = {
  id: null,
  type: null,
  name: '',
  description: '',
  location: null,
  city: null,
  state: null,
  country: null,
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
interface ContributionStore extends CommunityFormData {
  getFormData: () => CommunityFormData;
  updateFormField: <K extends keyof CommunityFormData>(
    field: K,
    value: CommunityFormData[K]
  ) => void;
  reset: () => void;
  // funciones para las imagenes
  addImages: (files: File[]) => void;
  removeImage: (index: number) => void;
  removeSchedule: (index: number) => void;
  setFormData: (data: CommunityFormData) => void;
}

// Hook to use in steps
export const useContributionStore = create<ContributionStore>((set, get) => ({
  ...INITIAL_FORM_STATE,

  // Getter para obtener todos los datos del formulario
  getFormData: () => {
    const state = get();
    return {
      id: state.id,
      user_id: state.user_id,
      type: state.type,
      name: state.name,
      description: state.description,
      location: state.location,
      city: state.city,
      state: state.state,
      country: state.country,
      images: state.images,
      floor_type: state.floor_type,
      is_covered: state.is_covered,
      schedule: state.schedule,
      services: state.services,
      age_group: state.age_group,
      categories: state.categories,
    };
  },

  updateFormField: (field, value) =>
    set((state) => {
      const newState = { ...state, [field]: value };

      // Si se está actualizando el tipo, limpiar campos específicos del tipo anterior
      if (field === 'type') {
        const newType = value as CommunityType | null;

        switch (newType) {
          case 'club':
            // Si cambió a club, limpiar age_group (usado solo en pickup)
            newState.age_group = null;
            break;
          case 'pickup':
            // Si cambió a pickup, limpiar categories (usado solo en club)
            newState.categories = null;
            break;
          case null:
          default:
            // Si no hay tipo seleccionado, limpiar ambos
            newState.age_group = null;
            newState.categories = null;
            break;
        }
      }

      return newState;
    }),

  reset: () => set(INITIAL_FORM_STATE),
  setFormData: (data) => set(data),
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
