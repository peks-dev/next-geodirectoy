'use client';

import Button from '@/app/components/ui/Button';
import { LogoutIcon } from '@/app/components/ui/svgs';
import { useAuth } from '@/app/(auth)/hooks/useAuth';
import { useModalStore } from '@/app/components/ui/Modal';

export default function LogoutButton() {
  const { logout, isLoggingOut } = useAuth();
  const { openModal } = useModalStore();

  const handleLogout = () => {
    openModal({
      title: 'cerrar sesión',
      content: '¿deseas salir de tu cuenta?',
      confirmButton: {
        text: 'si salir',
        variant: 'primary',
        onClick: async () => {
          await logout(); // El hook ya maneja notificaciones y navegación
        },
      },
    });
  };

  return (
    <Button
      variant="icon"
      size="md"
      loading={isLoggingOut}
      onClick={handleLogout}
    >
      <LogoutIcon />
    </Button>
  );
}
