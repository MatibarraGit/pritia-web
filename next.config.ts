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
      }
    ]
  },
  experimental: {
    authInterrupts: true
  }
};

export default nextConfig;
