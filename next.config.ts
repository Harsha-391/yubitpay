import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 3G: CSS is ~5KB, inlining saves a 400ms round trip before fonts/images can start
  experimental: { inlineCss: true },
};

export default nextConfig;
