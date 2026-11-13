import type { NextConfig } from "next";

const vesuvioPath = "/vesuvio-pizza";
const vesuvioPages = ["carte-sur-place", "carte-a-emporter", "pizza-du-mois", "nouveautes", "experiences"];
const boutiquePath = "/cotecoeurcotejardin";
const templatePaths = ["/chezcaouette", "/wyler", vesuvioPath, boutiquePath];

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
    })).concat({
      source: boutiquePath + "/:page(shop|event|events|maison-boutique|meubles-exterieur|notre-histoire|notrehistoire|contact|contactus|marche-de-noel|helpdesk|terms|favoris)/:rest*",
      destination: boutiquePath + "/index.html",
    });
  },
};

export default nextConfig;
