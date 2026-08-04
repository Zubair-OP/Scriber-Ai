import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  allowedDevOrigins: ["172.28.224.1"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Tell Vercel's bundler not to tree-shake these server-only packages
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core", "puppeteer"],
};

export default nextConfig;
