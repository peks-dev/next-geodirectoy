// Tipos para el cache
interface AuthCacheData {
  verified: boolean;
  expires: number;
  userId: string;
  email: string;
}

// Configuración del cache
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos en milliseconds
const CACHE_KEY = 'auth-cache';

export const cacheService = {
  /**
   * Establece el cache de autenticación después de login exitoso
   */
  setAuthCache(user: { id: string; email: string }): void {
    const cacheData: AuthCacheData = {
      verified: true,
      expires: Date.now() + CACHE_DURATION,
      userId: user.id,
      email: user.email,
    };

    if (typeof document !== 'undefined') {
      const maxAge = Math.floor(CACHE_DURATION / 1000); // Convertir a segundos
      document.cookie = `${CACHE_KEY}=${JSON.stringify(cacheData)}; path=/; max-age=${maxAge}; samesite=lax`;
      console.log('✅ Cache de auth establecido para:', user.email);
    }
  },

  /**
   * Limpia el cache de autenticación
   */
  clearAuthCache(): void {
    if (typeof document !== 'undefined') {
      document.cookie = `${CACHE_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      console.log('🧹 Cache de auth limpiado');
    }
  },

  /**
   * Verifica si hay un cache válido (solo para uso interno del middleware)
   */
  isAuthCacheValid(cookieValue: string): boolean {
    try {
      const { verified, expires }: AuthCacheData = JSON.parse(cookieValue);
      return verified && Date.now() < expires;
    } catch {
      return false;
    }
  },

  /**
   * Obtiene los datos del cache si están disponibles
   */
  getAuthCacheData(cookieValue: string): AuthCacheData | null {
    try {
      const cacheData: AuthCacheData = JSON.parse(cookieValue);
      if (cacheData.verified && Date.now() < cacheData.expires) {
        return cacheData;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Fuerza la limpieza del cache (útil para debugging o casos especiales)
   */
  forceClearCache(): void {
    this.clearAuthCache();
    console.log('🔧 Cache forzosamente limpiado');
  },

  /**
   * Verifica el estado del cache (útil para debugging)
   */
  getCacheStatus(): {
    hasCache: boolean;
    isValid: boolean;
    expiresAt?: Date;
    userId?: string;
  } {
    if (typeof document === 'undefined') {
      return { hasCache: false, isValid: false };
    }

    const cookies = document.cookie.split(';');
    const authCookie = cookies.find((cookie) =>
      cookie.trim().startsWith(`${CACHE_KEY}=`)
    );

    if (!authCookie) {
      return { hasCache: false, isValid: false };
    }

    const cookieValue = authCookie.split('=')[1];
    const cacheData = this.getAuthCacheData(cookieValue);

    if (!cacheData) {
      return { hasCache: true, isValid: false };
    }

    return {
      hasCache: true,
      isValid: true,
      expiresAt: new Date(cacheData.expires),
      userId: cacheData.userId,
    };
  },
};

// Exportar también los tipos para uso externo si es necesario
export type { AuthCacheData };
