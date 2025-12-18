'use client';

import Button from '@/app/components/ui/Button';
import { EditProfile } from '@/app/components/ui/svgs';
import EditProfileForm from './EditProfileForm';
import { useModalStore } from '@/app/components/ui/Modal';
import { useUpdateProfile } from '../hooks';
import {
  showSuccessToast,
  handleSubmissionError,
} from '@/shared/notifications';

export default function EditProfileBtn() {
  const { openModal } = useModalStore();
  const { handleUpdateProfile, isLoading } = useUpdateProfile();

  const handleClick = () => {
    openModal({
      title: 'Editar perfil',
      ContentComponent: EditProfileForm,
      confirmButton: {
        text: 'enviar',
        variant: 'primary',
        onClick: async () => {
          try {
            await handleUpdateProfile();
            showSuccessToast('Perfil actualizado correctamente');
          } catch (error) {
            handleSubmissionError(error);
          }
        },
      },
      isLoading,
    });
  };

  return (
    <Button variant="icon" onClick={handleClick}>
      <EditProfile />
    </Button>
  );
}
