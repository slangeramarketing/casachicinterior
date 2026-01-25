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
      },{
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },

  // 🔥 VERY IMPORTANT — silence Turbopack
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,

  // dev mode me SW off (BEST PRACTICE)
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
