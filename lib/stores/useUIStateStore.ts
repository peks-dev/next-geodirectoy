import { create } from 'zustand';

/**
 * Store global para coordinar el estado de los paneles y componentes UI
 * Asegura que solo un panel/componente esté visible a la vez
 */

type ActivePanel = 'community' | null;

interface UIState {
  // Estado del panel activo
  activePanel: ActivePanel;

  // Funciones para manejar el estado
  setActivePanel: (panel: ActivePanel) => void;
  closeActivePanel: () => void;

  // Funciones específicas para componentes
  openCommunityPanel: () => void;
  closeCommunityPanel: () => void;

  // Verificación de estado
  isPanelOpen: (panel: ActivePanel) => boolean;
  hasAnyPanelOpen: () => boolean;
}

export const useUIStateStore = create<UIState>((set, get) => ({
  activePanel: null,

  setActivePanel: (panel) => set({ activePanel: panel }),

  closeActivePanel: () => set({ activePanel: null }),

  openCommunityPanel: () => set({ activePanel: 'community' }),

  closeCommunityPanel: () => {
    const state = get();
    if (state.activePanel === 'community') {
      set({ activePanel: null });
    }
  },

  isPanelOpen: (panel) => get().activePanel === panel,

  hasAnyPanelOpen: () => get().activePanel !== null,
}));
