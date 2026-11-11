import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  async rewrites() {
    return [{ source: "/chezcaouette", destination: "/chezcaouette/index.html" }];
  }
};

export default nextConfig;
