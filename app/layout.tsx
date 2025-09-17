import type { Metadata } from 'next';
import { Barlow, Iceland, Oxanium } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import BackgroundLines from '@/components/ui/BackgroundLines';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { createClient } from '@/lib/supabase/server';

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
    <html lang="en">
      <body
        className={`${barlow.variable} ${iceland.variable} ${oxanium.variable} antialiased relative`}
      >
        <BackgroundLines />
        <Toaster />
        <main className="relative z-[2]">
          <AuthProvider initialUser={user}>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}
