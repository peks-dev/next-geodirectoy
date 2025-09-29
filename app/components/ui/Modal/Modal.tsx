'use client';

import { createPortal } from 'react-dom';
import { useModalStore } from './useModalStore';
import Button from '@/components/ui/Button';
import FlexBox from '../containers/FlexBox';
import CloseIcon from '../svgs/CloseIcon';
import TransparentContainer from '../containers/TransparentContainer';

export const Modal = () => {
  const {
    isOpen,
    title,
    message,
    confirmText,
    variant,
    isLoading,
    hideConfirmation,
    executeConfirmation,
  } = useModalStore();

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={hideConfirmation} />
      <div className="relative mx-4 container-md">
        <FlexBox
          className="w-full bg-dark-primary p-sm mb-4"
          align="center"
          justify="between"
        >
          <h2 className="text-sm font-bold uppercase neon-effect">{title}</h2>
          <Button
            variant="icon"
            onClick={hideConfirmation}
            disabled={isLoading}
          >
            <CloseIcon />
          </Button>
        </FlexBox>

        <TransparentContainer>
          <p className="text-center text-base mb-4">{message}</p>
          <Button
            variant={variant}
            onClick={executeConfirmation}
            disabled={isLoading}
          >
            {isLoading ? <p>...cargando</p> : confirmText}
          </Button>
        </TransparentContainer>
      </div>
    </div>,
    document.body
  );
};
