import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/jonnyjackson26/device-frames-media/**',
      },
    ],
  },
};

export default nextConfig;
