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
      // ---- Old paths still requested by Google (Search Console 404 report, Oct 2026) ----
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/sitemap", destination: "/site-map", permanent: true },
      { source: "/terms-of-service", destination: "/terms-and-conditions", permanent: true },
      { source: "/services/detail/terms-and-conditions", destination: "/terms-and-conditions", permanent: true },
      { source: "/blog", destination: "/blogs", permanent: true },
      { source: "/blog/:slug", destination: "/blogs/:slug", permanent: true },

      {
        // Serve one hostname only: www -> bare domain (308)
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.casachicinterior.com",
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
            value: "casachicinterior.in",
          },
        ],
        destination: "https://casachicinterior.com/:path*",
        permanent: true,
      },
      {
        // www.casachicinterior.in was serving the full site as a duplicate host
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.casachicinterior.in",
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
