import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calvin Vazquez — Créateur de contenu visuel",
  description: "Portfolio de Calvin Vazquez : design, photographie, vidéo et expériences digitales."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
