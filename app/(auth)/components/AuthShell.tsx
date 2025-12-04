// app/(auth)/components/AuthShell.tsx
'use client';

import { useEffect } from 'react';
import { AuthProvider } from './AuthProvider';
import { showErrorToast } from '@/app/components/toast/notificationService';
import type { User } from '@/lib/supabase/types';

interface AuthShellProps {
  children: React.ReactNode;
  initialUser: User | null;
  authError: {
    code: string;
    title: string;
    message: string;
    action?: string;
  } | null;
}

/**
 * Componente que encapsula la lógica de auth shell
 * Según tu arquitectura: UI → Custom hook → Server action → Database
 * Maneja errores específicos del sistema de auth con notificaciones
 */
export function AuthShell({
  children,
  initialUser,
  authError,
}: AuthShellProps) {
  // ✅ Mostrar notificación específica cuando hay error de auth
  useEffect(() => {
    if (authError) {
      const description = authError.action
        ? `${authError.message}\n\n${authError.action}`
        : authError.message;

      showErrorToast(authError.title, description);
    }
  }, [authError]);

  return <AuthProvider initialUser={initialUser}>{children}</AuthProvider>;
}
