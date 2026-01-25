import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  basePath: "/docs",
  assetPrefix: "/docs",
};

export default nextConfig;
