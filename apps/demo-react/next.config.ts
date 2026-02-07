import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@kkocot/honeycomb-react", "@kkocot/honeycomb-core"],
};

export default nextConfig;
