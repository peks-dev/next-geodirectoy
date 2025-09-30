import type { Metadata } from 'next';
import { Barlow, Iceland, Oxanium } from 'next/font/google';
import './globals.css';
import BackgroundLines from '@/components/ui/BackgroundLines';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/server';
import ClientProviders from '@/components/ClientProviders';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

// 1. Configura las fuentes con next/font
const barlow = Barlow({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-barlow', // Crea la variable CSS --font-barlow
});
const oxanium = Oxanium({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-oxanium', // Crea la variable CSS --font-oxanium
});

const iceland = Iceland({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-iceland', // Crea la variable CSS --font-iceland
});

export const metadata: Metadata = {
  title: 'Basket Places',
  description: 'Directorio de comunidades de basketball',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${barlow.variable} ${iceland.variable} ${oxanium.variable} antialiased relative w-[100vw] h-[100dvh]`}
      >
        <ThemeProvider>
          <BackgroundLines />
          <main className="relative z-[2] w-full h-full">
            <AuthProvider initialUser={user}>
              <ClientProviders>{children}</ClientProviders>
            </AuthProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
