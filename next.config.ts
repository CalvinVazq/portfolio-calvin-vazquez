import type { NextConfig } from "next";

const vesuvioPath = "/vesuvio-pizza";
const vesuvioPages = ["carte-sur-place", "carte-a-emporter", "pizza-du-mois", "nouveautes", "experiences"];
const templatePaths = ["/chezcaouette", "/wyler", vesuvioPath];

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return templatePaths.map((path) => ({
      source: path + "/:file*",
      headers: [{ key: "X-Robots-Tag", value: "noindex" }],
    }));
  },
  async rewrites() {
    return [
      ...templatePaths,
      ...vesuvioPages.map((page) => `${vesuvioPath}/${page}`),
    ].map((path) => ({
      source: path,
      destination: path + "/index.html",
    }));
  },
};

export default nextConfig;
