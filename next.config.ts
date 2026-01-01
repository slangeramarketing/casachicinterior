import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Static export for shared hosting
  output: "export",

  // ✅ Required when using next/image on static hosting
  images: {
    unoptimized: true,
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
    ],
  },

  // ❌ REMOVE serverActions (not supported in static export)
  // ❌ REMOVE reactCompiler (not needed for static hosting)

  // ⚠️ Experimental features disabled for static build
  experimental: {},

};

export default nextConfig;
