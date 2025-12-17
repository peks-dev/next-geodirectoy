import { create } from 'zustand';

interface PanelLoaderState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const usePanelLoaderStore = create<PanelLoaderState>((set) => ({
  isLoading: false,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
