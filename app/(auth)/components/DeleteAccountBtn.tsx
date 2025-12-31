'use client';

import { DeleteIcon } from '@/app/components/ui/svgs';
import IconBox from '@/app/components/ui/IconBox';
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
        text: 'eliminar',
        variant: 'primary',
        onClick: async () => {
          if (!profile) return;

          const result = await deleteAccount(profile);

          if (result.success) {
            await logout();
            showSuccessToast('Cuenta eliminada exitosamente');
          } else {
            showErrorToast(result.error.message);
          }
        },
      },
      content: '!CUIDADO! esta acción es irreversible y permanente',
    });
  };

  return (
    <button
      onClick={handleClick}
      className={`text-error hover-neon-text flex w-full cursor-pointer items-start justify-start gap-2 px-4 py-2`}
    >
      <IconBox icon={<DeleteIcon />} size="small" />
      <span>Eliminar cuenta</span>
    </button>
  );
}
