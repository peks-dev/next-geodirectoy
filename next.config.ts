import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvvmbnevtogthudqnjjv.supabase.co', // El ID de tu proyecto de Supabase
        port: '',
        pathname: '/storage/v1/object/public/community-images/**', // Sé específico sobre la ruta del bucket
      },
    ],
  },
};

export default nextConfig;
