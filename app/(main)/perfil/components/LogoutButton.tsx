'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { LogoutIcon } from '@/app/components/ui/svgs';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';

import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';

export default function LogoutButton() {
  const router = useRouter();
  const { logout, loading } = useAuth();
  const { showConfirmation } = useModalStore();

  const handleLogout = () => {
    showConfirmation({
      title: 'cerrar sesión',
      message: '¿deseas salir de tu cuenta?',
      confirmText: 'si salir',
      onConfirm: async () => {
        try {
          const { error } = await logout();
          if (!error) {
            showSuccessToast('Sesión cerrada correctamente');

            // Redirigir al home
            router.push('/');
            router.refresh(); // Opcional: fuerza refresh para limpiar estado
          }
        } catch (error) {
          showErrorToast('Error inesperado al cerrar sesión');
        }
      },
    });
  };

  return (
    <Button
      variant="icon"
      size="default"
      loading={loading}
      onClick={handleLogout}
    >
      <LogoutIcon />
    </Button>
  );
}
