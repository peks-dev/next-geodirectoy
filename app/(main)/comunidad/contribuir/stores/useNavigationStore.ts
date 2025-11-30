import { create } from 'zustand';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface NavigationStore {
  currentStep: StepNumber;

  // Acciones básicas
  setCurrentStep: (step: StepNumber) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetToStart: () => void;

  // Utilidades
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
  isFirstStep: () => boolean;
  isLastStep: () => boolean;
  getProgressPercentage: () => number;
}

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  currentStep: 1,

  // Navegación básica
  setCurrentStep: (step: StepNumber) => {
    set({ currentStep: step });
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < 9) {
      set({ currentStep: (currentStep + 1) as StepNumber });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: (currentStep - 1) as StepNumber });
    }
  },

  resetToStart: () => {
    set({ currentStep: 1 });
  },

  // Utilidades de estado
  canGoNext: () => {
    const { currentStep } = get();
    return currentStep < 9;
  },

  canGoPrev: () => {
    const { currentStep } = get();
    return currentStep > 1;
  },

  isFirstStep: () => {
    const { currentStep } = get();
    return currentStep === 1;
  },

  isLastStep: () => {
    const { currentStep } = get();
    return currentStep === 9;
  },

  getProgressPercentage: () => {
    const { currentStep } = get();
    // Solo contar steps visibles (2-8) para el progreso
    if (currentStep <= 1) return 0;
    if (currentStep >= 9) return 100;

    const visibleStep = currentStep - 1; // Steps 2-8 se convierten en 1-7
    return Math.round((visibleStep / 7) * 100);
  },
}));
