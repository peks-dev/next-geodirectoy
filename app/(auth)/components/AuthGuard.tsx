'use client';
// Componente para proteger UI que requieren Auth en paginas publicas
import { useAuth } from './AuthProvider';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode; // Opcional: qué mostrar si no auth
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>;
  if (!user) return fallback || null; // No redirige, solo oculta

  return <>{children}</>;
}
