'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface MapState {
  center: [number, number];
  zoom: number;
  lastInteraction: number;
  setMapPosition: (center: [number, number], zoom: number) => void;
  resetToDefault: () => void;
}

const DEFAULT_CENTER: [number, number] = [23.6345, -102.5528]; // México
const DEFAULT_ZOOM = 5;
const EXPIRY_DAYS = 7;
const EXPIRY_MS = EXPIRY_DAYS * 24 * 60 * 60 * 1000;

export const useMapStateStore = create<MapState>()(
  persist(
    (set) => ({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      lastInteraction: Date.now(),

      setMapPosition: (center: [number, number], zoom: number) => {
        set({
          center,
          zoom,
          lastInteraction: Date.now(),
        });
      },

      resetToDefault: () => {
        set({
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          lastInteraction: Date.now(),
        });
      },
    }),
    {
      name: 'basket-places-home-map-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        center: state.center,
        zoom: state.zoom,
        lastInteraction: state.lastInteraction,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Verificar si pasaron más de 7 días desde la última interacción
          const now = Date.now();
          if (now - state.lastInteraction > EXPIRY_MS) {
            // Resetear a valores por defecto si expiró
            state.center = DEFAULT_CENTER;
            state.zoom = DEFAULT_ZOOM;
            state.lastInteraction = now;
          }
        }
      },
    }
  )
);
