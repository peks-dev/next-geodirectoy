import { toast } from 'sonner';

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

// Toast de advertencia.
export const showWarningToast = (title: string, description?: string) => {
  toast.warning(title, {
    description,
    duration: 4500,
  });
};

// Toast de información.
export const showInfoToast = (title: string, description?: string) => {
  toast.info(title, {
    description,
    duration: 3500,
  });
};
