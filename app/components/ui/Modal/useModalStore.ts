// components/ui/ConfirmationModal/useConfirmationStore.ts
import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  variant: 'delete' | 'primary' | 'secondary' | 'tertiary';
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
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
      // Podrías mostrar toast de error aquí
    } finally {
      setLoading(false);
    }
  },
}));
