'use client';

import Button from '@/app/components/ui/Button';
import { LogoutIcon } from '@/app/components/ui/svgs';
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';

export default function LogoutButton() {
  const { logout, isLoggingOut } = useAuth();
  const { showConfirmation } = useModalStore();

  const handleLogout = () => {
    showConfirmation({
      title: 'cerrar sesión',
      message: '¿deseas salir de tu cuenta?',
      confirmText: 'si salir',
      onConfirm: async () => {
        await logout(); // El hook ya maneja notificaciones y navegación
      },
    });
  };

  return (
    <Button
      variant="icon"
      size="default"
      loading={isLoggingOut}
      onClick={handleLogout}
    >
      <LogoutIcon />
    </Button>
  );
}
