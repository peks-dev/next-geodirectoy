'use client';

import Button from '@/app/components/ui/Button';
import { EditProfile } from '@/app/components/ui/svgs';
import EditProfileForm from './EditProfileForm';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';
import { useUpdateProfile } from '../hooks/useUpdateProfile';

import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';

export default function EditProfileBtn() {
  const { showConfirmation } = useModalStore();
  const { handleUpdateProfile, isLoading } = useUpdateProfile();

  const handleClick = () => {
    showConfirmation({
      title: 'Editar perfil',
      ContentComponent: EditProfileForm,
      onConfirm: async () => {
        try {
          const result = await handleUpdateProfile();

          if (!result.success) {
            throw new Error(result.message);
          }
          showSuccessToast('se actualizo el perfil');
        } catch (error) {
          if (error instanceof Error) {
            showErrorToast(error.message);
          } else {
            showErrorToast('Un error inesperado ocurrió.');
          }
        }
      },
      confirmText: 'enviar',
      isLoading: isLoading,
    });
  };

  return (
    <Button variant="icon" onClick={handleClick}>
      <EditProfile />
    </Button>
  );
}
