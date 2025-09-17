// En el perfil
import { ProtectedWrapper } from '@/app/components/auth/ProtectedWrapper';

export default function ContributionPage() {
  return (
    <ProtectedWrapper>
      <div className="container mx-auto p-4">
        <h1>pagina de contribución</h1>
      </div>
    </ProtectedWrapper>
  );
}
