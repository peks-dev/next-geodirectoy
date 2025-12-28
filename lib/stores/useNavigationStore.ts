import { create } from 'zustand';

interface NavigationLoaderStore {
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
}

export const useNavigationLoaderStore = create<NavigationLoaderStore>(
  (set) => ({
    isNavigating: false,
    setIsNavigating: (value) => set({ isNavigating: value }),
  })
);
