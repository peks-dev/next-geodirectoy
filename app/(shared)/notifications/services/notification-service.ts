import { triggerToast } from '../components/baseToast';
import { ToastType } from '../types';

// Configuración centralizada de toasts
const TOAST_CONFIG = {
  durations: {
    success: 4000,
    error: 5000,
    warning: 4500,
    info: 4000,
    action: 6000,
  },
  defaults: {
    error: 'Por favor, intenta nuevamente.',
  },
} as const;

// Factory para crear funciones de toast
const createToast =
  (type: ToastType, defaultDuration: number) =>
  (title: string, description?: string, options?: { duration?: number }) => {
    triggerToast(
      {
        type,
        title,
        description:
          description ||
          (type === 'error' ? TOAST_CONFIG.defaults.error : undefined),
      },
      {
        duration: options?.duration ?? defaultDuration,
      }
    );
  };

// Toast de éxito estándar
export const showSuccessToast = createToast(
  'success',
  TOAST_CONFIG.durations.success
);

// Toast de error estándar
export const showErrorToast = createToast(
  'error',
  TOAST_CONFIG.durations.error
);

// Toast de advertencia
export const showWarningToast = createToast(
  'warning',
  TOAST_CONFIG.durations.warning
);

// Toast de información
export const showInfoToast = createToast('info', TOAST_CONFIG.durations.info);

// Toast personalizado con botón de acción
export const showToastWithAction = (
  title: string,
  description: string,
  type: ToastType,
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
      duration: TOAST_CONFIG.durations.action,
    }
  );
};
