// components/ui/ConfirmationModal/useModalStore.ts
import { create } from 'zustand';
import { ReactNode, ComponentType } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  variant: 'delete' | 'primary' | 'secondary' | 'tertiary';
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
  // Nuevas propiedades para componentes React
  content?: ReactNode;
  ContentComponent?: ComponentType<Record<string, unknown>>;
  contentProps?: Record<string, unknown>;
}

interface ModalActions {
  showConfirmation: (config: Partial<ModalState>) => void;
  hideConfirmation: () => void;
  executeConfirmation: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalState & ModalActions>((set, get) => ({
  // Estado inicial
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'primary',
  onConfirm: () => {},
  isLoading: false,
  content: undefined,
  ContentComponent: undefined,
  contentProps: undefined,

  // Acciones
  showConfirmation: (config) => {
    set({
      ...config,
      isOpen: true,
      isLoading: false,
    });
  },

  hideConfirmation: () => {
    set({
      isOpen: false,
      isLoading: false,
      message: '',
      content: undefined,
      ContentComponent: undefined,
      contentProps: undefined,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  executeConfirmation: async () => {
    const { onConfirm, hideConfirmation, setLoading } = get();
    setLoading(true);
    try {
      await onConfirm();
      hideConfirmation();
    } catch (error) {
      console.error('Error en confirmación:', error);
    } finally {
      setLoading(false);
    }
  },
}));
