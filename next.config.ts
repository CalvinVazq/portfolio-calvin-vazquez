import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  async rewrites() {
    return [
      { source: "/chezcaouette", destination: "/chezcaouette/index.html" },
      { source: "/wyler", destination: "/wyler/index.html" },
    ];
  }
};

export default nextConfig;
