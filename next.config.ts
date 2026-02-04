import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'device-frames.fly.dev',
        pathname: '/frames/**',
      },
    ],
  },
};

export default nextConfig;
