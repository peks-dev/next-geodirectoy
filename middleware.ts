// middleware.ts - Versión simplificada
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

interface CookieData {
  name: string;
  value: string;
  options?: {
    maxAge?: number;
    expires?: Date;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    path?: string;
    domain?: string;
  };
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const { pathname } = request.nextUrl;
  const protectedRoutes = ['/contribuir', '/perfil'];
  const authRoutes = ['/sign-in'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // 🚀 OPTIMIZACIÓN: Solo para rutas protegidas, verificar cache primero
  if (isProtectedRoute) {
    const authCache = request.cookies.get('auth-cache')?.value;
    if (authCache) {
      try {
        const { verified, expires } = JSON.parse(authCache);
        if (verified && Date.now() < expires) {
          // Cache válido - No consultar Supabase
          return response;
        }
      } catch {
        // Cache corrupto, proceder a verificación completa
      }
    }
  }

  // Solo aquí consultamos Supabase (cuando no hay cache válido)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieData[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Lógica de redirección (sin cambios)
  if (isProtectedRoute && !user) {
    response.cookies.delete('auth-cache'); // Limpiar cache inválido
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isAuthRoute && user) {
    const redirectTo = request.nextUrl.searchParams.get('redirectTo');
    const redirectUrl = new URL(redirectTo || '/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
