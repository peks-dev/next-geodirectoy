// store/useGlobalMenuStore.ts
import { create } from 'zustand';

interface GlobalMenuState {
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

export const useGlobalMenuStore = create<GlobalMenuState>((set) => ({
  isMenuOpen: false,
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),
}));
