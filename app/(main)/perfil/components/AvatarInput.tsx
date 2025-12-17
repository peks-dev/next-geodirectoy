'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useEditProfileFormStore } from '../stores/useEditProfileFormStore';

export default function RoundImageInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { avatarPreviewUrl, setAvatar } = useEditProfileFormStore();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatar(file);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex h-24 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-gray-400 bg-gray-300"
        title="Haz clic para seleccionar una imagen"
      >
        {avatarPreviewUrl ? (
          <Image
            src={avatarPreviewUrl}
            alt="Vista previa del avatar"
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl text-gray-500">+</span>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
