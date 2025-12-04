// app/(auth)/database/dbQueries.server.ts
'use server';
import { createClient } from '@/lib/supabase/server';
import { fromSupabaseError, DatabaseError } from '@/lib/errors/database';
import { AuthErrorCodes } from '@/app/(auth)/errors/codes';
import { ErrorCodes } from '@/lib/errors/codes';

/**
 * Verifica el código OTP del usuario
 * @param email - Email del usuario
 * @param token - Código OTP de 6 dígitos
 * @returns Objeto con user y session
 */
export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });

  if (error) {
    throw fromSupabaseError(
      error,
      'Error verificando el código OTP',
      AuthErrorCodes.INVALID_CREDENTIALS
    );
  }

  if (!data.user) {
    throw new DatabaseError(
      'No se pudo autenticar al usuario',
      AuthErrorCodes.UNAUTHORIZED
    );
  }

  return {
    user: data.user,
    session: data.session!,
  };
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns Usuario autenticado o null
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error && error.message !== 'Auth session missing!') {
    throw fromSupabaseError(
      error,
      'Error obteniendo usuario actual',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return user;
}

/**
 * Obtiene la sesión activa del usuario
 * @returns Sesión activa o null
 */
export async function getCurrentSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error && error.message !== 'Auth session missing!') {
    throw fromSupabaseError(
      error,
      'Error obteniendo sesión actual',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return session;
}

/**
 * Elimina la cuenta del usuario autenticado
 * @returns Objeto con success y message
 */
export async function deleteAccountFromDb() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('delete_user_account');

  // Primero verificar errores de conexión
  if (error) {
    throw fromSupabaseError(
      error,
      'Error eliminando la cuenta',
      ErrorCodes.DATABASE_ERROR
    );
  }

  // Luego verificar la respuesta de la función RPC
  if (!data || !data.success) {
    throw new DatabaseError(
      data?.message || 'No se pudo eliminar la cuenta',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return {
    success: true,
    message: data.message || 'Cuenta eliminada exitosamente',
  };
}

/**
 * Verifica si un email ya está registrado
 * @param email - Email a verificar
 * @returns Boolean indicando si existe
 */
export async function checkEmailExists(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no encontrado
    throw fromSupabaseError(
      error,
      'Error verificando existencia del email',
      ErrorCodes.DATABASE_ERROR
    );
  }

  return !!data;
}
