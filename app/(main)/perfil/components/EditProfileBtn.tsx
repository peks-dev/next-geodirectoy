'use client';

import Button from '@/app/components/ui/Button';
import { EditProfile } from '@/app/components/ui/svgs';
import EditProfileForm from './EditProfileForm';
import { useModalStore } from '@/app/components/ui/Modal/useModalStore';
import { useUpdateProfile } from '../hooks';
import {
  showSuccessToast,
  handleSubmissionError,
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
          await handleUpdateProfile();
          showSuccessToast('Perfil actualizado correctamente');
        } catch (error) {
          handleSubmissionError(error);
        }
      },
      confirmText: 'enviar',
      isLoading,
    });
  };

  return (
    <Button variant="icon" onClick={handleClick}>
      <EditProfile />
    </Button>
  );
}
