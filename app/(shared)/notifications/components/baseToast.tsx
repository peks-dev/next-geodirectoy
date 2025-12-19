'use client';
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import Button from '@/app/components/ui/Button';
import type { ToastProps, ToastType } from '../types';

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
