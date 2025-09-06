import { supabase } from './client';
import type {
  AuthStateChangeCallback,
  AuthSubscription,
  ServiceResponse,
  SimpleResponse,
  User,
  UserMetadata,
  Session,
} from './types';

// Función auxiliar para manejar errores de forma consistente
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado.';
}

export const authService = {
  /**
   * Envía un código de verificación de 6 dígitos (OTP) al correo del usuario.
   * Este es el primer paso para el inicio de sesión sin contraseña.
   */
  async sendLoginCode(email: string): SimpleResponse {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // Clave: NO incluimos `emailRedirectTo`.
          // Supabase enviará una plantilla de correo con el código OTP.
          shouldCreateUser: true,
        },
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  },

  /**
   * Verifica el código OTP que el usuario recibió en su correo.
   * Este es el segundo y último paso para completar el inicio de sesión.
   */
  async verifyEmailOtp(
    email: string,
    token: string
  ): ServiceResponse<{ user: User; session: Session }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email', // Especificamos que es un OTP de tipo email.
      });

      if (error) throw error;
      return {
        data: { user: data.user!, session: data.session! },
        error: null,
      };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  /**
   * Cierra la sesión del usuario actual.
   */
  async logout(): SimpleResponse {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  },

  /**
   * Obtiene los datos del usuario autenticado actualmente.
   */
  async getCurrentUser(): ServiceResponse<User> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      return { data: user, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  /**
   * Obtiene la sesión activa del usuario.
   */
  async getCurrentSession(): ServiceResponse<Session> {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      return { data: session, error: null };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  /**
   * Actualiza los metadatos (perfil) del usuario actual.
   */
  async updateProfile(updates: UserMetadata): SimpleResponse {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  },

  /**
   * Escucha los cambios en el estado de autenticación (login, logout, etc.).
   */
  onAuthStateChange(callback: AuthStateChangeCallback): AuthSubscription {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return { data: { subscription }, error: null };
  },
};
