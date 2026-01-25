import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/demo",
  assetPrefix: "/demo",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.hive.blog",
      },
    ],
  },
};

export default nextConfig;
