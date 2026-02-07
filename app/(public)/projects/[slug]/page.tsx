import PublicDetailProject from '@/components/public/project-page/PublicDetailProject';
import { projects } from '@/lib/data/projects';
import { notFound } from 'next/navigation';

interface Props{
  params: Promise<{slug:string}>;
}

import { Metadata } from 'next';

// Naya metadata generator function
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) return { title: 'Project Not Found' };

  return {
    title: `${project.title} | Casa Chic Interior`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: [project.coverImage], // Ye image social media sharing mein dikhegi 🖼️
    },
  };
}

export default async function ProjectServerPage(
  {params}:Props
){
  const { slug } = await params;
  
  // ID ki jagah SLUG se find karein
  const project = projects.find(p => p.slug === slug);
  console.log("Project: ",project);
  if (!project) notFound();

  return (
    <div>
       <PublicDetailProject project={project} />
    </div>
  )
}
