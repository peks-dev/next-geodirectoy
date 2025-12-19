export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  type: ToastType;
  button?: {
    label: string;
    onClick: () => void;
  };
}
