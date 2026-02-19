import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "/demo/react-next",
  assetPrefix: "/demo/react-next",
  reactStrictMode: true,
  transpilePackages: ["@barddev/honeycomb-react", "@kkocot/honeycomb-core"],
  async redirects() {
    return [
      {
        source: "/",
        destination: "/demo/react-next",
        basePath: false,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
