import type { NextConfig } from "next";

const templatePaths = ["/chezcaouette", "/wyler"];

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return templatePaths.map((path) => ({
      source: path + "/:file*",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
  async rewrites() {
    return templatePaths.map((path) => ({
      source: path,
      destination: path + "/index.html",
    }));
  },
};

export default nextConfig;
