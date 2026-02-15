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
