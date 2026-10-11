/***************************************************
 * Server Page: app/(public)/projects/[slug]/page.tsx
 * - Projects are static data (lib/data/projects.ts).
 * - Unknown slugs return a real 404 via notFound().
 ***************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import PublicDetailProject from "@/components/public/project-page/PublicDetailProject";
import JsonLd from "@/components/public/seo/JsonLd";
import { projects } from "@/lib/data/projects";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { breadcrumbJsonLd } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/seo/siteConfig";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Project Not Found", robots: { index: false, follow: false } };
  }

  const siteUrl = await getSiteUrl();
  const canonical = absoluteUrl(siteUrl, `/projects/${project.slug}`);
  const title = `${project.title} | Casa Chic Interior`;
  const image = absoluteUrl(siteUrl, project.coverImage);

  return {
    title,
    description: project.shortDescription,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: canonical,
      siteName: siteConfig.name,
      type: "article",
      images: [{ url: image, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [image],
    },
  };
}

export default async function ProjectServerPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const siteUrl = await getSiteUrl();
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: project.title },
  ];

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(siteUrl, breadcrumbs)} />
      <PublicDetailProject
        project={project}
        breadcrumbs={breadcrumbs.map((b) => ({ name: b.name, href: b.path }))}
      />
    </div>
  );
}
