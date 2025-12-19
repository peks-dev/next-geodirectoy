import { triggerToast } from '../components/baseToast';

// Toast de éxito estándar
export const showSuccessToast = (title: string, description?: string) => {
  triggerToast(
    {
      type: 'success',
      title,
      description,
    },
    {
      duration: 4000,
    }
  );
};

// Toast de error estándar
export const showErrorToast = (title: string, description?: string) => {
  triggerToast(
    {
      type: 'error',
      title,
      description: description || 'Por favor, intenta nuevamente.',
    },
    {
      duration: 5000,
    }
  );
};

// Toast de advertencia
export const showWarningToast = (title: string, description?: string) => {
  triggerToast(
    {
      type: 'warning',
      title,
      description,
    },
    {
      duration: 4500,
    }
  );
};

// Toast de información
export const showInfoToast = (title: string, description?: string) => {
  triggerToast(
    {
      type: 'info',
      title,
      description,
    },
    {
      duration: 4000,
    }
  );
};

// Toast personalizado con botón de acción
export const showToastWithAction = (
  title: string,
  description: string,
  type: 'success' | 'error' | 'warning' | 'info',
  buttonLabel: string,
  onButtonClick: () => void
) => {
  triggerToast(
    {
      type,
      title,
      description,
      button: {
        label: buttonLabel,
        onClick: onButtonClick,
      },
    },
    {
      duration: 6000,
    }
  );
};
