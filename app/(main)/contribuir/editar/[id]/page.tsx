import ContributionForm from '@/app/(main)/contribuir/components/ContributionForm';
import { ProtectedWrapper } from '@/app/(auth)/components/ProtectedWrapper';
import { getCommunityById } from '@/lib/data/communities';
import { transformResponseToFormData } from '@/lib/data/processors';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Esta es una página de servidor (Server Component) para buscar los datos
export default async function EditContributionPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Obtener datos raw desde Supabase
  const communityResponse = await getCommunityById(id);

  // 2. Si no se encuentran datos, mostrar 404
  if (!communityResponse) {
    notFound();
  }

  // 3. Transformar a formato de formulario
  const formData = transformResponseToFormData(communityResponse);

  // 4. Renderizamos el mismo componente de formulario, pasándole los datos iniciales
  return (
    <ProtectedWrapper>
      <section className="mx-auto h-full p-4">
        <ContributionForm initialData={formData} />;
      </section>
    </ProtectedWrapper>
  );
}
