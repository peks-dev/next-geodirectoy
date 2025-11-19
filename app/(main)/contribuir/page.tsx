// Pagina para registrar comunidades de basketball

import { ProtectedWrapper } from '@/app/(auth)/components/ProtectedWrapper';
import ContributionForm from './components/ContributionForm';

export default async function ContributionPage() {
  return (
    <ProtectedWrapper>
      <section className="mx-auto h-full p-4">
        <ContributionForm />
      </section>
    </ProtectedWrapper>
  );
}
