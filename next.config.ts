import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React Strict Mode
  reactStrictMode: true,

  // Images configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'profile.line-scdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sprofile.line-scdn.net',
        pathname: '/**',
      },
    ],
  },

  // Experimental features for Next.js 15+
  experimental: {
    // Enable if needed
  },

  // Headers for LIFF
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
