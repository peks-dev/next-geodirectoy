'use client';

import Button from '@/app/components/ui/Button';
import { DeleteIcon } from '@/app/components/ui/svgs';
import { useModalStore } from '@/app/components/ui/Modal';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import { deleteAccount } from '@/app/(auth)/actions/deleteAccount';
import { useAuth } from '@/app/(auth)/hooks/useAuth';

import { showErrorToast, showSuccessToast } from '@/shared/notifications';

export default function DeleteAccountBtn() {
  const { openModal } = useModalStore();
  const { profile } = useProfileStore.getState();
  const { logout } = useAuth();

  const handleClick = () => {
    openModal({
      title: 'Eliminar cuenta',
      confirmButton: {
        text: 'si, eliminar',
        variant: 'delete',
        onClick: async () => {
          if (profile) {
            try {
              const result = await deleteAccount(profile);
              if (!result.success) {
                throw new Error(result.error.message);
              }
              await logout();
              showSuccessToast('Cuenta eliminada exitosamente');
            } catch (error) {
              if (error instanceof Error) {
                showErrorToast(error.message);
              }
              showErrorToast('algo salio mal');
            }
          }
        },
      },
      content: '!CUIDADO! esta acción es irreversible y permanente',
    });
  };

  return (
    <Button variant="icon" onClick={handleClick} className="text-error">
      <DeleteIcon />
    </Button>
  );
}
