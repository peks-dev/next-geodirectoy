'use client';

import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePathname } from 'next/navigation';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';
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
  const { user, isLoggingOut } = useAuth();

  const { navigate } = useCustomNavigation();
  const pathname = usePathname();

  // evitar llamadas durante render
  useEffect(() => {
    if (!user && !isLoggingOut) {
      console.log('ejecutado', user);
      // ✅ Guarda la URL actual como parámetro de retorno
      const returnUrl = encodeURIComponent(pathname);
      navigate(`${redirectTo}?returnUrl=${returnUrl}`);
    }
  }, [user, isLoggingOut, navigate, redirectTo, pathname]);

  // isLoggingOut state
  if (isLoggingOut) {
    return (
      fallback || (
        <div className="flex h-full items-center justify-center">
          <div className="border-accent-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
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
