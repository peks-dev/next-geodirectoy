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

import {
  onAuthStateChange,
  logout as logoutQuery,
  setSession,
} from '../database/dbQueries.browser';
import { useProfileStore } from '@/app/(main)/perfil/stores/useProfileStore';
import { useCommunitiesProfileStore } from '@/app/(main)/perfil/stores/useCommunitiesProfileStore';
import { showErrorToast, showSuccessToast } from '@/shared/notifications';
import type { User, AuthChangeEvent, Session } from '@/lib/supabase/types';
import { DatabaseError } from '@/lib/errors/database';
import { useCustomNavigation } from '@/lib/hooks/useNavigation';

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  waitForAuth: () => Promise<User | null>;
  setUserAndSession: (user: User, session: Session) => Promise<void>;
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
  const { navigate } = useCustomNavigation();
  const authResolvers = useRef<Array<(user: User | null) => void>>([]);

  useEffect(() => {
    const subscription = onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          useProfileStore.getState().clearProfile();
          useCommunitiesProfileStore.getState().clearCommunities();
          authResolvers.current.forEach((resolve) => resolve(null));
          authResolvers.current = [];
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
        }
      }
    );

    return () => {
      if (subscription.data?.subscription) {
        subscription.data.subscription.unsubscribe();
      }
    };
  }, []);

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

  // sincronizar con authFlow al iniciar
  const setUserAndSession = useCallback(
    async (user: User, session: Session) => {
      await setSession(session);
      setUser(user);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await logoutQuery();
      showSuccessToast('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      let errorMessage = 'Error inesperado al cerrar sesión';
      if (error instanceof DatabaseError) {
        errorMessage = error.message; // Usamos el mensaje user-friendly del error
      } else if (error instanceof Error) {
        errorMessage = error.message; // Fallback por si acaso
      }
      showErrorToast('Error al cerrar sesión', errorMessage);
      throw error;
    }
  }, [navigate]);

  return (
    <AuthContext.Provider
      value={{ user, logout, waitForAuth, setUserAndSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}
