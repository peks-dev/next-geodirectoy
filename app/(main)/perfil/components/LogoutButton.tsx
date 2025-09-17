'use client';

import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import { useAuth } from '@/app/components/auth/AuthProvider';
import { toast } from 'sonner';

export function LogoutButton() {
  const router = useRouter();
  const { logout, loading } = useAuth(); // Ahora usa loading del contexto

  async function handleLogout() {
    try {
      const { error } = await logout();
      if (error) {
        toast.error('Error al cerrar sesión', {
          description: error,
        });
        return;
      }

      toast.success('Sesión cerrada correctamente');

      // Redirigir al home
      router.push('/');
      router.refresh(); // Opcional: fuerza refresh para limpiar estado
    } catch (error) {
      toast.error('Error inesperado al cerrar sesión');
      console.error('Logout error:', error);
    }
  }

  return (
    <Button
      variant="secondary"
      size="default"
      loading={loading} // Usa el loading global del contexto
      onClick={handleLogout}
      className="grow-0"
    >
      Cerrar sesión
    </Button>
  );
}
