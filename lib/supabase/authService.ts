import { supabase } from './client';
import { cacheService } from './cacheService';
import type {
  AuthStateChangeCallback,
  AuthSubscription,
  ServiceResponse,
  SimpleResponse,
  User,
  Session,
  ProfileUpdate,
} from './types';

// Función auxiliar para manejar errores de forma consistente
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Ha ocurrido un error inesperado.';
}

export const authService = {
  // Enviar codigo OTP para empezar inicio de sesion
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

  // Verifica el código OTP para completar inicio de sesion
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

      // ESTABLECER CACHE automáticamente después de login exitoso
      if (data.user && data.user.email) {
        cacheService.setAuthCache({
          id: data.user.id,
          email: data.user.email,
        });
      }

      return {
        data: { user: data.user!, session: data.session! },
        error: null,
      };
    } catch (error) {
      return { data: null, error: getErrorMessage(error) };
    }
  },

  // Cierra la sesión del usuario actual y limpia el cache.
  async logout(): SimpleResponse {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // LIMPIAR CACHE automáticamente en logout
      cacheService.clearAuthCache();

      return { error: null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  },

  // Obtiene los datos del usuario autenticado actualmente.
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

  // Obtiene la sesión activa del usuario.
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

  // Actualiza el perfil del usuario en la tabla profiles.
  async updateProfile(updates: ProfileUpdate): SimpleResponse {
    try {
      // Obtener el usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('Usuario no autenticado');

      // Actualizar el perfil en la tabla profiles
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  },

  // Escucha los cambios en el estado de autenticación (login, logout, etc.).
  onAuthStateChange(callback: AuthStateChangeCallback): AuthSubscription {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(callback);
    return { data: { subscription }, error: null };
  },

  // Métodos de conveniencia para acceder al cache desde el authService

  // Acceso rápido para limpiar el cache desde el authService
  clearCache(): void {
    cacheService.forceClearCache();
  },

  // Acceso rápido para verificar el estado del cache desde el authService
  getCacheStatus() {
    return cacheService.getCacheStatus();
  },
};
