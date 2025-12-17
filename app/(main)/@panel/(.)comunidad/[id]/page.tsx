import { notFound } from 'next/navigation';
import { getCommunityById } from '@/app/(main)/comunidad/dbQueries';
import PanelContent from './PanelContent';

interface ModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CommunityModal({ params }: ModalPageProps) {
  const { id } = await params;
  const community = await getCommunityById(id);

  if (!community) {
    notFound();
  }

  return <PanelContent community={community} />;
}
