'use client';

import { useState, useRef, useEffect } from 'react';
import Button from '@/app/components/ui/Button';
import SettingsIcon from '@/app/components/ui/svgs/SettingsIcon';
import EditProfileBtn from './EditProfileBtn';
import DeleteAccountBtn from '@/app/(auth)/components/DeleteAccountBtn';

export default function DropdownProfileOptions() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Opciones de perfil"
        aria-expanded={isOpen}
        className="p-2"
      >
        <SettingsIcon />
      </Button>
      {isOpen && (
        <div className="bg-background-interactive absolute right-0 z-50 mt-2 w-72 shadow-lg">
          <div className="flex flex-col py-1">
            <EditProfileBtn />
            <DeleteAccountBtn />
          </div>
        </div>
      )}
    </div>
  );
}
