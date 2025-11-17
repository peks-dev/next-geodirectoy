'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/lib/supabase/authService';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import type { User, AuthChangeEvent, Session } from '@/lib/supabase/types';

interface AuthContextType {
  // Estado del usuario
  user: User | null;
  loading: boolean;

  // Solo métodos que afectan directamente el estado
  logout: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>; // Para compatibilidad
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const clearProfile = useProfileStore((state) => state.clearProfile);

  const router = useRouter();
  const pathname = usePathname();

  // Escuchar cambios de auth usando authService
  useEffect(() => {
    const subscription = authService.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          clearProfile();
          // Define las rutas públicas aquí
          const publicRoutes = ['/']; // ['/', '/about']

          // Solo redirige si la ruta actual NO es pública
          const isOnPublicRoute =
            publicRoutes.includes(pathname) ||
            publicRoutes.some((route) => pathname.startsWith(route));
          if (!isOnPublicRoute) {
            router.push('/sign-in');
          }
        } else if (event === 'SIGNED_IN' && session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
          } as User);
          router.refresh();
        }
      }
    );

    return () => {
      if (subscription.data?.subscription) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, [router, pathname]);

  // Solo logout porque afecta directamente el estado del usuario
  const logout = async (): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      const result = await authService.logout();
      if (result.error) {
        console.error('Error al cerrar sesión:', result.error);
        return { error: result.error };
      }
      clearProfile();
      return { error: null };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return { error: 'Error inesperado al cerrar sesión' };
    } finally {
      setLoading(false);
    }
  };

  // Método heredado para compatibilidad
  const signOut = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
