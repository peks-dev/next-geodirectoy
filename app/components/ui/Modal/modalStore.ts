// components/ui/Modal/modalStore.ts
import { create } from 'zustand';
import { ReactNode, ComponentType } from 'react';

interface ModalConfig {
  isOpen: boolean;
  title: string;
  content?: ReactNode;
  ContentComponent?: ComponentType<Record<string, unknown>>;
  contentProps?: Record<string, unknown>;
  confirmButton?: {
    text: string;
    variant: 'delete' | 'primary' | 'secondary' | 'tertiary';
    onClick: () => Promise<void> | void;
  };
  isLoading: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface ModalActions {
  openModal: (config: Partial<ModalConfig>) => void;
  closeModal: () => void;
  handleConfirm: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useModalStore = create<ModalConfig & ModalActions>((set, get) => ({
  // Estado inicial simplificado
  isOpen: false,
  title: '',
  content: undefined,
  ContentComponent: undefined,
  contentProps: undefined,
  confirmButton: undefined,
  isLoading: false,

  // Acciones con nombres claros
  openModal: (config) =>
    set({
      ...config,
      isOpen: true,
      isLoading: false,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      isLoading: false,
      content: undefined,
      ContentComponent: undefined,
      contentProps: undefined,
    }),

  handleConfirm: async () => {
    const { confirmButton, closeModal, setLoading } = get();
    if (!confirmButton?.onClick) return;

    setLoading(true);
    try {
      await confirmButton.onClick();
      closeModal();
    } catch (error) {
      console.error('Modal confirmation error:', error);
    } finally {
      setLoading(false);
    }
  },

  setLoading: (loading) => set({ isLoading: loading }),
}));
