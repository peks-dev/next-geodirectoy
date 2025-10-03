'use client';

import { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface ProtectedWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedWrapper({
  children,
  fallback,
  redirectTo = '/sign-in',
}: ProtectedWrapperProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // evitar llamadas durante render
  useEffect(() => {
    if (!user && !loading) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  // Loading state
  if (loading) {
    return (
      fallback || (
        <div className="flex h-full items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-orange-500"></div>
        </div>
      )
    );
  }

  // No renderizar, espera el effect para navegar
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
