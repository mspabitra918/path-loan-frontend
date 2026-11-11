import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (a lockfile exists in a parent folder).
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
