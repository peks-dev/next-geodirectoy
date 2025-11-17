'use client';

import Input from '@/app/components/ui/inputs/Text';
import RoundImageInput from './AvatarInput';
import { useEditProfileFormStore } from '../stores/useEditProfileFormStore';
import { useEffect } from 'react';

export default function EditProfileForm() {
  const { name, setName, clearForm } = useEditProfileFormStore();

  useEffect(() => {
    return () => {
      clearForm();
    };
  }, [clearForm]);

  return (
    <form className="gap-lg flex flex-col items-center py-4">
      <div>
        <RoundImageInput />
      </div>
      <Input
        id="name"
        type="text"
        placeholder="tu nuevo nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
    </form>
  );
}
