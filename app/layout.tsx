import type { Metadata } from 'next';
import { Iceland, Oxanium } from 'next/font/google';
import './globals.css';
import { AuthShell } from '@/app/(auth)/components/AuthShell';
import { getAuthShellData } from '@/app/(auth)/actions/getAuthShellData';
import ClientProviders from '@/components/ClientProviders';
import { ThemeProvider } from '@/components/theme/ThemeProvider';

// 1. Configura las fuentes con next/font
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
  // ✅ Usar el nuevo sistema de auth shell con manejo de errores específico
  const { initialUser, authError } = await getAuthShellData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${iceland.variable} ${oxanium.variable} relative h-[100dvh] w-[100vw] antialiased`}
      >
        <ThemeProvider>
          <main className="relative z-[2] h-full w-full">
            <AuthShell initialUser={initialUser} authError={authError}>
              <ClientProviders>{children}</ClientProviders>
            </AuthShell>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
