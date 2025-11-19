// lib/supabase/authService.server.ts
'use server';
import { createClient } from '@/lib/supabase/server';

/**
 * Verifica el código OTP del usuario
 * @param email - Email del usuario
 * @param token - Código OTP de 6 dígitos
 * @returns Objeto con user y session, o error
 */
export async function verifyOtp(email: string, token: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;
    if (!data.user) throw new Error('No se pudo autenticar al usuario');

    return {
      data: {
        user: data.user,
        session: data.session!,
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'Error desconocido al verificar OTP',
    };
  }
}

/**
 * Obtiene el usuario actualmente autenticado
 * @returns Usuario autenticado o null
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;
    return { data: user, error: null };
  } catch (error) {
    return {
      data: null,
      error:
        error instanceof Error
          ? error.message
          : 'Error al obtener usuario actual',
    };
  }
}

/**
 * Obtiene la sesión activa del usuario
 * @returns Sesión activa o null
 */
export async function getCurrentSession() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;
    return { data: session, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Error al obtener sesión',
    };
  }
}

// Función para eliminar la cuenta del usuario autenticado
export async function deleteAccountFromDb() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('delete_user_account');

    // Primero verificar errores de conexión
    if (error) throw error;

    // Luego verificar la respuesta de la función RPC
    if (!data || !data.success) {
      throw new Error(data?.message || 'No se pudo eliminar la cuenta');
    }

    return {
      success: true,
      message: data.message || 'cuenta eliminada',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    } else {
      return {
        success: false,
        message: 'no se pudo eliminar la cuenta de supabase',
      };
    }
  }
}

/**
 * Verifica si un email ya está registrado
 * @param email - Email a verificar
 * @returns Boolean indicando si existe
 */
export async function checkEmailExists(email: string) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no encontrado
      throw error;
    }

    return { data: !!data, error: null };
  } catch (error) {
    return {
      data: false,
      error:
        error instanceof Error ? error.message : 'Error al verificar email',
    };
  }
}
