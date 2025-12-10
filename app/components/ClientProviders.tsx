'use client';
import { Toaster } from 'sonner';
import { Modal } from '@/app/components/ui/Modal';
import GlobalMenu from './Menu';

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
      <GlobalMenu />
    </>
  );
}
