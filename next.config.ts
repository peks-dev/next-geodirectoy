import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bvvmbnevtogthudqnjjv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/community-images/**',
      },
      // Nueva regla para el bucket de avatares
      {
        protocol: 'https',
        hostname: 'bvvmbnevtogthudqnjjv.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/avatars/**',
      },
    ],
  },
};

export default nextConfig;
