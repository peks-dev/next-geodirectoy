// components/ui/ConfirmationModal/Modal.tsx
'use client';
import { createPortal } from 'react-dom';
import { useModalStore } from './useModalStore';
import Button from '@/components/ui/Button';
import FlexBox from '../containers/FlexBox';
import { CloseIcon } from '../svgs/';

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
    content,
    ContentComponent,
    contentProps,
  } = useModalStore();

  if (!isOpen) return null;

  // ✨ NUEVA FUNCIÓN
  const renderContent = () => {
    if (ContentComponent) {
      return <ContentComponent {...(contentProps || {})} />;
    }

    if (content) {
      return content;
    }

    if (message) {
      return <p className="mb-4 text-center text-base">{message}</p>;
    }

    return null;
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={hideConfirmation} />
      <div className="container-md relative mx-4">
        <FlexBox
          className="bg-dark-primary p-sm mb-4 w-full"
          align="center"
          justify="between"
        >
          <h2 className="neon-effect text-sm font-bold uppercase">{title}</h2>
          <Button
            variant="icon"
            onClick={hideConfirmation}
            disabled={isLoading}
          >
            <CloseIcon />
          </Button>
        </FlexBox>
        <div className="transparent-container p-sm">
          {renderContent()} {/* ✨ CAMBIO PRINCIPAL */}
          <Button
            variant={variant}
            onClick={executeConfirmation}
            disabled={isLoading}
          >
            {isLoading ? <p>...cargando</p> : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};
