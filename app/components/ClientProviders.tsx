'use client';
import { Toaster } from 'sonner';
import { Modal } from '@/app/components/ui/Modal';
import GlobalMenu from './Menu';
import PanelLoader from '../(main)/map/components/PanelLoader';
import { usePanelLoaderStore } from '../(main)/map/stores/usePanelStore';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = usePanelLoaderStore();
  return (
    <>
      <Toaster position="top-center" />
      {children}
      <Modal />
      <GlobalMenu />
      {isLoading && <PanelLoader />}
    </>
  );
}
