'use client';
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import Button from '@/app/components/ui/Button';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  type: ToastType;
  button?: {
    label: string;
    onClick: () => void;
  };
}

/** A fully custom toast that still maintains the animations and interactions. */
function BaseToast(props: ToastProps) {
  const { title, description, button, id, type } = props;

  const toastClasses = (type: ToastType) => {
    const classes = {
      success: 'bg-success text-success border-success',
      error: 'bg-error text-error border-error',
      warning: 'bg-warning text-warning border-warning',
      info: 'bg-border text-border border-border',
    };
    return classes[type];
  };

  const colorClasses = toastClasses(type);

  return (
    <div className={`transparent-container flex gap-4 p-4`}>
      {/* Línea decorativa con neón */}
      <div
        className={`w-2 max-w-2 grow shadow-[0_0_8px_currentColor,0_0_12px_currentColor] ${colorClasses}`}
      />

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-2">
        <p className="font-heading text-foreground text-xs font-semibold uppercase">
          {title}
        </p>
        {description && (
          <p className="text-2xs text-foreground leading-relaxed opacity-90">
            {description}
          </p>
        )}
        {button && (
          <div className="mt-2">
            <Button
              variant="tertiary"
              onClick={() => {
                button.onClick();
                sonnerToast.dismiss(id);
              }}
            >
              {button.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function triggerToast(
  toast: Omit<ToastProps, 'id'>,
  options?: { duration?: number }
) {
  return sonnerToast.custom(
    (id) => (
      <BaseToast
        id={id}
        title={toast.title}
        description={toast.description}
        type={toast.type}
        button={toast.button}
      />
    ),
    {
      duration: options?.duration || 4000,
    }
  );
}

// Componente de ejemplo/demo (puedes removerlo en producción)
export default function Headless() {
  return (
    <div className="flex flex-wrap gap-4">
      <button
        className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]"
        onClick={() => {
          triggerToast({
            type: 'success',
            title: 'Operación exitosa',
            description: 'Los datos se han guardado correctamente.',
            button: {
              label: 'Ver detalles',
              onClick: () => console.log('Ver detalles clicked'),
            },
          });
        }}
      >
        Success Toast
      </button>

      <button
        className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]"
        onClick={() => {
          triggerToast({
            type: 'error',
            title: 'Error al procesar',
            description:
              'No se pudo completar la operación. Intenta nuevamente.',
          });
        }}
      >
        Error Toast
      </button>

      <button
        className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]"
        onClick={() => {
          triggerToast({
            type: 'warning',
            title: 'Advertencia',
            description: 'Algunos campos requieren tu atención.',
          });
        }}
      >
        Warning Toast
      </button>

      <button
        className="relative flex h-10 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:text-white dark:hover:bg-[#1A1A19]"
        onClick={() => {
          triggerToast({
            type: 'info',
            title: 'Información',
            description: 'Recuerda revisar los cambios antes de continuar.',
          });
        }}
      >
        Info Toast
      </button>
    </div>
  );
}
