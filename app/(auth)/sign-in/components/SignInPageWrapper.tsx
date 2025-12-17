'use client';

import { Suspense } from 'react';
import AuthForm from '@/auth/components/AuthForm/index';

function SignInPageContent() {
  return <AuthForm />;
}

export default function SignInPageWrapper() {
  return (
    <section className="p-md flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Cargando...</div>}>
        <SignInPageContent />
      </Suspense>
    </section>
  );
}
