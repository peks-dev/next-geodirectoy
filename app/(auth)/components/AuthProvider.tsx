// components/auth/AuthProvider.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  onAuthStateChange,
  logout as logoutService,
} from '../services/authService.browser';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import { useCommunitiesProfileStore } from '@/app/(main)/perfil/stores/useCommunitiesProfileStore';
import type { User, AuthChangeEvent, Session } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  waitForAuth: () => Promise<User | null>;
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
  const { clearCommunities } = useCommunitiesProfileStore.getState();

  const authResolvers = useRef<Array<(user: User | null) => void>>([]);

  useEffect(() => {
    const subscription = onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          clearProfile();

          authResolvers.current.forEach((resolve) => resolve(null));
          authResolvers.current = [];

          const publicRoutes = ['/'];
          const isOnPublicRoute =
            publicRoutes.includes(pathname) ||
            publicRoutes.some((route) => pathname.startsWith(route));

          if (!isOnPublicRoute) {
            router.push('/sign-in');
          }
        }
        // ✅ CLAVE: Manejar SIGNED_IN e INITIAL_SESSION
        else if (
          (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
          session
        ) {
          const newUser = {
            id: session.user.id,
            email: session.user.email,
          } as User;

          setUser(newUser);

          // ✅ Resuelve todas las promises esperando
          authResolvers.current.forEach((resolve) => resolve(newUser));
          authResolvers.current = [];

          router.refresh();
        }
      }
    );

    return () => {
      if (subscription.data?.subscription) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, [router, pathname, clearProfile]);

  const logout = async (): Promise<{ error: string | null }> => {
    setLoading(true);
    try {
      const result = await logoutService();
      if (result.error) {
        console.error('Error al cerrar sesión:', result.error);
        return { error: result.error };
      }
      // Limpieza de datos del usuario logeado
      clearProfile();
      clearCommunities();

      return { error: null };
    } catch (error) {
      console.error('Unexpected error during logout:', error);
      return { error: 'Error inesperado al cerrar sesión' };
    } finally {
      setLoading(false);
    }
  };

  const waitForAuth = useCallback((): Promise<User | null> => {
    if (user) {
      return Promise.resolve(user);
    }

    return new Promise((resolve) => {
      // Timeout de seguridad
      const timeoutId = setTimeout(() => {
        const index = authResolvers.current.indexOf(resolve);
        if (index > -1) {
          authResolvers.current.splice(index, 1);
        }

        resolve(null);
      }, 2000);

      // ✅ Wrapper que limpia el timeout al resolver
      const wrappedResolve = (user: User | null) => {
        clearTimeout(timeoutId);
        resolve(user);
      };

      // Agrega el resolver wrapped
      authResolvers.current.push(wrappedResolve);
    });
  }, [user]);

  const signOut = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        logout,
        signOut,
        waitForAuth,
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
