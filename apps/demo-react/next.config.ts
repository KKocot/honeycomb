import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/demo/react",
  assetPrefix: "/demo/react",
  reactStrictMode: true,
  transpilePackages: ["@barddev/honeycomb-react", "@kkocot/honeycomb-core"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/demo/react",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
