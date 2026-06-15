import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Pin tracing root to this app — avoids picking up ~/package-lock.json
  outputFileTracingRoot: projectRoot,

  // Production optimizations
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Performance optimizations
  compress: true,
  
  // Output standalone for optimal deployment
  output: 'standalone',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Custom redirects (if needed)
  async redirects() {
    return [
      { source: "/datasets", destination: "/dataportal", permanent: false },
      { source: "/datasets/:slug", destination: "/dataportal/:slug", permanent: false },
      {
        source: '/dashboard',
        destination: '/login',
        permanent: false,
        has: [
          {
            type: 'cookie',
            key: 'user-role',
            value: 'public',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
