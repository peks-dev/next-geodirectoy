import type {
  AuthChangeEvent,
  Provider as SupabaseProvider,
  Session,
  Subscription,
  User,
  UserMetadata as SupabaseUserMetadata,
} from '@supabase/supabase-js';

// ========== Re-exportación de Tipos de Supabase ==========
export type { User, Session, AuthChangeEvent, Subscription };
export type Provider = SupabaseProvider;

// ========== Tipos para profile ==========

export interface Profile {
  /** ID único del usuario (UUID) - referencia a auth.users(id) */
  id: string;
  /** Nombre del usuario (máximo 100 caracteres) */
  name?: string;
  /** URL del avatar del usuario */
  avatar_url?: string;
  /** Fecha de creación del perfil */
  created_at: string;
  /** Fecha de última actualización del perfil */
  updated_at: string;
}

export interface ProfileUpdate {
  /** Nombre del usuario (máximo 100 caracteres) */
  name?: string;
  /** URL del avatar del usuario */
  avatar_url?: string;
}

/**
 * Metadatos del usuario para el registro o la actualización del perfil.
 */
export type UserMetadata = SupabaseUserMetadata;

// ========== Tipos para las Respuestas del Servicio ==========
/**
 * Respuesta genérica de nuestro servicio, que contiene datos o un mensaje de error.
 */
export type ServiceResponse<T> = Promise<{
  data: T | null;
  error: string | null;
}>;

/**
 * Respuesta para acciones que no devuelven datos específicos en caso de éxito.
 */
export type SimpleResponse = Promise<{
  error: string | null;
}>;

// ========== Tipos para Subscripciones ==========
/**
 * La firma de la función callback para `onAuthStateChange`.
 */
export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

/**
 * El objeto de subscripción que devuelve `onAuthStateChange`.
 */
export type AuthSubscription = {
  data: { subscription: Subscription };
  error: Error | null;
};
