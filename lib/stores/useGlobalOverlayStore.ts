import { create } from 'zustand';

interface GlobalOverlayState {
  isActive: boolean;
  activate: () => void;
  deactivate: () => void;
  toggle: () => void;
}

export const useGlobalOverlayStore = create<GlobalOverlayState>((set) => ({
  isActive: false,
  activate: () => set({ isActive: true }),
  deactivate: () => set({ isActive: false }),
  toggle: () => set((state) => ({ isActive: !state.isActive })),
}));
