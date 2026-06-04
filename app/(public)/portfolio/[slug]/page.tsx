import { Metadata } from "next";
import { notFound } from "next/navigation";
import dummyData from "../dummy-data.json";
import { dummyServices } from "@/lib/data/dummy-services";
import { projects } from "@/lib/data/projects";
import DetailClient from "./DetailClient";
import ServiceDetailClient from "./ServiceDetailClient";
import ProjectDetailClient from "./ProjectDetailClient";
import { reviewServer } from "@/modules/review/review.server";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SEO METADATA GENERATION
 */
export async function generateMetadata(
  { params }: ProjectPageProps
): Promise<Metadata> {
  const { slug } = await params;
  
  // 1. Check if it's a Service
  const service = dummyServices.find(s => s.slug === slug);
  if (service) {
    return {
      title: `${service.title} | CasaChic Interior`,
      description: service.shortDescription,
      openGraph: {
        images: [service.heroImage],
      },
    };
  }

  // 2. Check if it's a Project from projects.ts
  const project = projects.find(p => p.slug === slug);
  if (project) {
    return {
      title: `${project.title} | CasaChic Interior`,
      description: project.shortDescription,
      openGraph: {
        images: [project.coverImage],
      },
    };
  }

  // 3. Fallback to legacy project/dummy data
  const legacyProject = dummyData.find(d => d.slug === slug);
  if (legacyProject) {
    return {
      title: `${legacyProject.title} | ${legacyProject.category} | CasaChic`,
      description: legacyProject.overview,
      openGraph: {
        images: [legacyProject.heroImage],
      },
    };
  }

  return { title: "Not Found | CasaChic Interior" };
}

/**
 * STATIC PARAMS FOR OPTIMIZATION
 */
export async function generateStaticParams() {
  const legacySlugs = dummyData.map((d) => ({ slug: d.slug }));
  const serviceSlugs = dummyServices.map((s) => ({ slug: s.slug }));
  const projectSlugs = projects.map((p) => ({ slug: p.slug }));
  
  return [...legacySlugs, ...serviceSlugs, ...projectSlugs];
}

export default async function DetailServicePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  
  // 1. If it's a Service, render the Service layout
  const service = dummyServices.find(s => s.slug === slug);
  if (service) {
    return <ServiceDetailClient service={service} />;
  }

  // 2. If it's a Project, render the new Project layout
  const project = projects.find(p => p.slug === slug);
  if (project) {
    const reviews = await reviewServer.getPublicFeaturedReviews();
    return <ProjectDetailClient project={project} reviews={reviews} />;
  }

  // 3. If it's a legacy project, render the old layout
  const legacyProject = dummyData.find(d => d.slug === slug);
  if (legacyProject) {
    return <DetailClient service={legacyProject} />;
  }

  notFound();
}
