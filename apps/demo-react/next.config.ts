import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/demo/react",
  assetPrefix: "/demo/react",
  reactStrictMode: true,
  transpilePackages: ["@kkocot/honeycomb-react", "@kkocot/honeycomb-core"],
};

export default nextConfig;
