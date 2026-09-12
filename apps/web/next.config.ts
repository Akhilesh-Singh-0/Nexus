import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nexus/db", "@nexus/config"],
};

export default nextConfig;
