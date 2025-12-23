// components/ui/Modal/Modal.tsx
'use client';
import { createPortal } from 'react-dom';
import { useEffect } from 'react';
import { useModalStore } from './modalStore';
import Button from '@/components/ui/Button';
import { CloseIcon } from '../svgs/';

export const Modal = () => {
  const {
    isOpen,
    title,
    content,
    ContentComponent,
    contentProps,
    confirmButton,
    isLoading,
    closeModal,
    handleConfirm,
    size,
  } = useModalStore();

  // Efecto para manejar la tecla Escape en desktop
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    // Solo añadir el listener si el modal está abierto
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (ContentComponent) {
      return <ContentComponent {...(contentProps || {})} />;
    }
    if (content) {
      return content;
    }
    return null;
  };

  const getMaxWidth = () => {
    switch (size) {
      case 'sm':
        return 'var(--width-xs)';
      case 'lg':
        return 'var(--width-md)';
      case 'md':
      default:
        return 'var(--width-sm)';
    }
  };

  return createPortal(
    <div className="p-sm fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 z-10 bg-black/50" onClick={closeModal} />

      <div
        className="z-20 w-full"
        style={{
          maxWidth: getMaxWidth(),
          minHeight: '20vh',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div className="bg-dark-primary p-sm mb-3 flex items-center justify-between">
          <h2 className="neon-effect text-light-secondary text-sm font-bold uppercase">
            {title}
          </h2>
          <Button variant="icon" onClick={closeModal} disabled={isLoading}>
            <CloseIcon />
          </Button>
        </div>

        <div className="transparent-container">
          {/* Contenido - sin scroll interno */}
          <div className="p-sm flex-1 overflow-visible text-center">
            {renderContent()}
          </div>
          {/* Footer */}
          {confirmButton && (
            <div className="p-sm">
              <Button
                variant={confirmButton.variant}
                onClick={handleConfirm}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <p>...cargando</p> : confirmButton.text}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
