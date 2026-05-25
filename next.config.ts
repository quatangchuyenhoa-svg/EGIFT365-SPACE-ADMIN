import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  /* config options here */
  reactCompiler: true,
  // Cấu hình cho Sanity Studio
  transpilePackages: ["next-sanity", "@sanity/vision"],
  // Allow cross-origin requests from local network in development
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.1.60",
    "192.168.2.200",
  ],
  env: {
    SC_DISABLE_SPEEDY: 'false',
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:9062"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
