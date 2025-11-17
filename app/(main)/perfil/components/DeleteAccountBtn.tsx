'use client';

import Button from '@/app/components/ui/Button';
import { DeleteIcon } from '@/app/components/ui/svgs';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';
import { useProfileStore } from '../stores/useProfileStore';
import { deleteAccount } from '../actions/deleteAccount';
import { useRouter } from 'next/navigation';

import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';

export default function DeleteAccountBtn() {
  const { showConfirmation } = useModalStore();
  const { profile } = useProfileStore.getState();
  const router = useRouter();

  const handleClick = () => {
    showConfirmation({
      title: 'Eliminar cuenta',
      confirmText: 'si, eliminar',
      message: '!CUIDADO! esta acción es irreversible y permanente',
      onConfirm: async () => {
        if (profile) {
          try {
            const result = await deleteAccount(profile);
            if (!result.success) {
              throw new Error(result.message);
            }
            router.push('/');
            showSuccessToast(result.message);
          } catch (error) {
            if (error instanceof Error) {
              showErrorToast(error.message);
            }
            showErrorToast('algo salio mal');
          }
        }
      },
    });
  };

  return (
    <Button variant="icon" onClick={handleClick} className="text-error">
      <DeleteIcon />
    </Button>
  );
}
