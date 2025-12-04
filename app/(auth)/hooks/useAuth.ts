// app/(auth)/hooks/useAuth.ts
'use client';
import { useContext, useState } from 'react';
import { AuthContext } from '../components/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logoutWithLoading = async () => {
    setIsLoggingOut(true);
    try {
      await context.logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    user: context.user,
    logout: logoutWithLoading,
    isLoggingOut,
    waitForAuth: context.waitForAuth,
  };
}
