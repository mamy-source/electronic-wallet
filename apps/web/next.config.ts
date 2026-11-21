import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "@electronic-wallet/shared",
    "@electronic-wallet/validation",
  ],
};

export default nextConfig;
