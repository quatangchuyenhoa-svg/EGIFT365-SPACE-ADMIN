import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Cấu hình cho Sanity Studio
  transpilePackages: ["next-sanity", "@sanity/vision"],
  // Allow cross-origin requests from local network in development
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.60",
  ],
};

export default nextConfig;
