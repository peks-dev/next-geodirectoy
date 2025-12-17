import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCommunityById } from '@/app/(main)/comunidad/dbQueries';
import { generateCommunityMetadata } from '../../../comunidad/utils/generateCommunityMetadata';
import type { CommunityFullResponse } from '@/comunidad/types';
import PanelContent from './PanelContent';

interface ModalPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ModalPageProps): Promise<Metadata> {
  const { id } = await params;
  const community: CommunityFullResponse | null = await getCommunityById(id);
  return generateCommunityMetadata(community);
}

export default async function CommunityModal({ params }: ModalPageProps) {
  const { id } = await params;
  const community = await getCommunityById(id);

  if (!community) {
    notFound();
  }

  return <PanelContent community={community} />;
}
