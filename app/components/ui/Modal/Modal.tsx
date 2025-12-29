// components/ui/Modal/Modal.tsx
'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

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
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-sm fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{
              scale: 0.95,
              y: -20,
              opacity: 0,
              transition: { duration: 0.15, ease: 'easeIn' },
            }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
