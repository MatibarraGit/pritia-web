import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        // Para imágenes de Cloudinary
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        // Para imágenes de Supabase de Electroben
        protocol: 'https',
        hostname: 'lmpthwignsmqnrsqntjl.supabase.co',
      }
    ]
  },
  experimental: {
    authInterrupts: true
  }
};

export default nextConfig;
