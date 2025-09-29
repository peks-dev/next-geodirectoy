import { useModalStore } from './useModalStore';

// Hook que solo expone las funciones que necesitan los componentes
export const useModal = () => {
  const showConfirmation = useModalStore((state) => state.showConfirmation);
  return { showConfirmation };
};
