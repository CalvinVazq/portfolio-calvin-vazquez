import { notFound } from "next/navigation";
import { PortfolioExperience } from "../../../components/PortfolioExperience";
import { getProject, projects } from "../../../data/projects";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getProject(slug)) notFound();
  return <PortfolioExperience />;
}
