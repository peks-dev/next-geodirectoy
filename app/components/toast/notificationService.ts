import React from 'react';
import { toast } from 'sonner';
import { ZodError } from 'zod';
import { getErrorMessages, type FieldError } from '@/lib/utils/errorHandler';
import ErrorToast from './ErrorToast';

//Toast de éxito estándar.
export const showSuccessToast = (title: string, description?: string) => {
  toast.success(title, {
    description,
    duration: 4000,
  });
};

// Toast de error estándar.
export const showErrorToast = (title: string, description?: string) => {
  toast.error(title, {
    description: description || 'Por favor, intenta nuevamente.',
    duration: 5000,
  });
};

// Toast de error detallado para errores de validación de formulario.
export const showFormValidationErrors = (errors: FieldError[]) => {
  toast(React.createElement(ErrorToast, { errors }), {
    duration: 8000,
    position: 'top-right',
  });
};

// Manejador de errores centralizado que determina qué toast mostrar
export const handleSubmissionError = (error: unknown) => {
  if (error instanceof ZodError) {
    const validationErrors = getErrorMessages(error);
    showFormValidationErrors(validationErrors);
  } else {
    const errors = getErrorMessages(error);
    if (errors.length > 0 && errors[0].message) {
      showErrorToast('Error al procesar el formulario', errors[0].message);
    } else {
      showErrorToast('Ha ocurrido un error inesperado');
    }
  }
};
