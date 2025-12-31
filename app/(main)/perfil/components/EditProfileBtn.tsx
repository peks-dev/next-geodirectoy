'use client';

import { EditProfile } from '@/app/components/ui/svgs';
import EditProfileForm from './EditProfileForm';
import { useModalStore } from '@/app/components/ui/Modal';
import { useUpdateProfile } from '../hooks';
import IconBox from '@/app/components/ui/IconBox';

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
        onClick: handleUpdateProfile,
      },
      isLoading,
    });
  };

  return (
    <button
      onClick={handleClick}
      className={
        'hover-neon-text text-accent-primary flex w-full cursor-pointer items-center justify-start gap-2 px-4 py-2'
      }
    >
      <IconBox size="small" icon={<EditProfile />} />

      <span>Editar perfil</span>
    </button>
  );
}
