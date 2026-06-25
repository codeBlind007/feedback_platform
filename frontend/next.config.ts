import type { NextConfig } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/user",
        destination: `${API_URL}/api/v1/auth/user`,
      },
      {
        source: "/api/v1/auth/:path*",
        destination: `${API_URL}/api/v1/auth/:path*`,
      },
      {
        source: "/api/v1/feedback/:path*",
        destination: `${API_URL}/api/v1/feedback/:path*`,
      },
    ];
  },
};

export default nextConfig;
