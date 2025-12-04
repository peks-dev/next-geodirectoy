// components/auth/AuthProvider.tsx
'use client';
import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useRef,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  onAuthStateChange,
  logout as logoutQuery,
} from '../database/dbQueries.browser';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import { useCommunitiesProfileStore } from '@/app/(main)/perfil/stores/useCommunitiesProfileStore';
import {
  showErrorToast,
  showSuccessToast,
} from '@/app/components/toast/notificationService';
import type { User, AuthChangeEvent, Session } from '@/lib/supabase/types';

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  waitForAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export { AuthContext };
export type { AuthContextType };

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();
  const pathname = usePathname();
  const authResolvers = useRef<Array<(user: User | null) => void>>([]);

  useEffect(() => {
    const subscription = onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);

          // Limpieza automática de stores
          useProfileStore.getState().clearProfile();
          useCommunitiesProfileStore.getState().clearCommunities();

          authResolvers.current.forEach((resolve) => resolve(null));
          authResolvers.current = [];

          const publicRoutes = ['/'];
          const isOnPublicRoute =
            publicRoutes.includes(pathname) ||
            publicRoutes.some((route) => pathname.startsWith(route));

          if (!isOnPublicRoute) {
            router.push('/sign-in');
          }
        } else if (
          (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') &&
          session
        ) {
          const newUser = {
            id: session.user.id,
            email: session.user.email,
          } as User;
          setUser(newUser);
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
  }, [router, pathname]);

  const waitForAuth = useCallback((): Promise<User | null> => {
    if (user) {
      return Promise.resolve(user);
    }
    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        const index = authResolvers.current.indexOf(resolve);
        if (index > -1) {
          authResolvers.current.splice(index, 1);
        }
        resolve(null);
      }, 2000);

      const wrappedResolve = (user: User | null) => {
        clearTimeout(timeoutId);
        resolve(user);
      };

      authResolvers.current.push(wrappedResolve);
    });
  }, [user]);

  // ✅ Logout centralizado en el Provider
  const logout = useCallback(async () => {
    try {
      await logoutQuery();
      showSuccessToast('Sesión cerrada correctamente');
      // El resto lo maneja el listener de onAuthStateChange
      router.push('/');
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error inesperado al cerrar sesión';
      showErrorToast(errorMessage);
      throw error;
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, logout, waitForAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
