// Pagina para registrar comunidades de basketball

import { ProtectedWrapper } from '@/app/components/auth/ProtectedWrapper';
import ContributionForm from './components/ContributionForm';

export default async function ContributionPage() {
  return (
    <ProtectedWrapper>
      <section className="mx-auto p-4 h-full">
        <ContributionForm />
      </section>
    </ProtectedWrapper>
  );
}
