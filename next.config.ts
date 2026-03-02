import type { NextConfig } from "next";
import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "casachicinterior.in",
          },
        ],
        destination: "https://casachicinterior.com/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "casachicinterior.online", // Exact match, won't affect staging subdomain
          },
        ],
        destination: "https://casachicinterior.com/:path*",
        permanent: true,
      },
    ];
  },

  turbopack: {},
};

export default withPWA({
  dest: "public",

  // ✅ register SW
  register: true,

  // 🔥 CRITICAL: stop auto-activation popup loop
  skipWaiting: false,

  // ✅ Disabled in development to stop the auto-compile loop
  disable: process.env.NODE_ENV !== "production",
})(nextConfig);
