import { getCommunityById } from '@/lib/data/communities';
import { notFound } from 'next/navigation';
import type { CommunityFullResponse } from '@/app/types/communityTypes';
import HeaderCommunity from '../components/HeaderCommunity';
import ContentCommunity from '../components/ContentCommunity';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CommunityPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch de la comunidad por ID
  const community: CommunityFullResponse | null = await getCommunityById(id);

  // Si no existe, mostrar página 404
  if (!community) {
    notFound();
  }

  return (
    <div className="gap-lg flex h-full w-full flex-col p-4 lg:flex-row">
      {/* Header con tipo y nombre */}
      <HeaderCommunity
        name={community.name}
        type={community.type}
        images={community.images}
        url={'hola'}
      />
      <ContentCommunity />
    </div>
  );
}
