'use client';
import { Toaster } from 'sonner';
import { Modal } from '@/app/components/ui/Modal';
import { GlobalOverlay } from '@/app/components/ui/GlobalOverlay';
import GlobalMenu from './Menu';
import PanelLoader from '../(main)/map/components/PanelLoader';
import { usePanelLoaderStore } from '../(main)/map/stores/usePanelStore';
import { NavigationLoader } from '@/app/components/ui/NavigationLoader';

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
      <GlobalOverlay />
      <Modal />
      <GlobalMenu />
      <NavigationLoader />
      {isLoading && <PanelLoader />}
    </>
  );
}
