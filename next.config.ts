import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore
    turbo: false,
    // @ts-ignore
    turbopack: false,
  },
  swcMinify: true,
};

export default nextConfig;
