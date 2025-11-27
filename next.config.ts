import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - eslint is a valid config option
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
