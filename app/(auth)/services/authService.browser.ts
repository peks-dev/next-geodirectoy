// lib/supabase/authService.ts (cliente/browser)
import { supabase } from '@/lib/supabase/client';
import type {
  AuthStateChangeCallback,
  AuthSubscription,
  SimpleResponse,
} from '@/lib/supabase/types';

// Función auxiliar para manejar errores de forma consistente
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado.';
}

/**
 * Envía código OTP al email para iniciar sesión
 * @param email - Email del usuario
 * @returns Error o null si fue exitoso
 */
export async function sendLoginCode(email: string): Promise<SimpleResponse> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Cierra la sesión del usuario actual
 * @returns Error o null si fue exitoso
 */
export async function logout(): Promise<SimpleResponse> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

/**
 * Escucha los cambios en el estado de autenticación
 * @param callback - Función que se ejecuta cuando cambia el estado
 * @returns Objeto con subscription para cleanup
 */
export function onAuthStateChange(
  callback: AuthStateChangeCallback
): AuthSubscription {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return { data: { subscription }, error: null };
}

// Exportar objeto authService para compatibilidad con código existente
export const authService = {
  sendLoginCode,
  logout,
  onAuthStateChange,
};
