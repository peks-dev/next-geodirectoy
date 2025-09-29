'use client';
import { Toaster } from 'sonner';
import { Modal } from '@/components/ui/Modal';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="top-center" />
      {children}
      <Modal />
    </>
  );
}
