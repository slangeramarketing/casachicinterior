import SingleProject from "@/components/clientPage/projects/SingleProject";
import { projects } from "@/lib/data/projects/projects";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}


export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {slug}=await params
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return <SingleProject project={project} />;
}
