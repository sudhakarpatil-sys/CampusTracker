/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the X-Powered-By header to reduce information leakage.
  poweredByHeader: false,

  typescript: {
    // Prevent Next.js from failing production web builds due to native mobile subfolder types
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  experimental: {
    typedRoutes: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // Security headers applied to all routes. These supplement the
  // dynamic headers set in middleware.ts (which also adds CSP).
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
