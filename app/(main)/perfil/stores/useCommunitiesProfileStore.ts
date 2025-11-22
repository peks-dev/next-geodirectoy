import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Community } from '@/app/types/communityTypes';

interface CommunitiesState {
  // Estado
  communities: Community[];

  // Acciones
  setCommunities: (communities: Community[]) => void;
  addCommunity: (community: Community) => void;
  removeCommunity: (communityId: string) => void;
  clearCommunities: () => void;
}

export const useCommunitiesProfileStore = create<CommunitiesState>()(
  persist(
    (set) => ({
      // Estado inicial
      communities: [],

      // Establecer el listado completo
      setCommunities: (communities) => set({ communities }),

      // Agregar una nueva comunidad al inicio
      addCommunity: (community) =>
        set((state) => ({
          communities: [community, ...state.communities],
        })),

      // Eliminar comunidad por ID
      removeCommunity: (communityId) =>
        set((state) => ({
          communities: state.communities.filter(
            (community) => community.id !== communityId
          ),
        })),

      // Limpiar el store
      clearCommunities: () => set({ communities: [] }),
    }),
    {
      name: 'basket-places-communities', // Nombre del key en localStorage
      storage: createJSONStorage(() => localStorage), // Especifica localStorage explícitamente
    }
  )
);
