import { Metadata } from "next";
import { notFound } from "next/navigation";
import dummyData from "../dummy-data.json";
import DetailClient from "./DetailClient";

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
  const service = dummyData.find(d => d.slug === slug);

  if (!service) return { title: "Service Not Found | CasaChic Interior" };

  return {
    title: `${service.title} | ${service.category} | CasaChic`,
    description: service.overview,
    openGraph: {
      images: [service.heroImage],
    },
  };
}

/**
 * STATIC PARAMS FOR OPTIMIZATION
 */
export async function generateStaticParams() {
  return dummyData.map((d) => ({
    slug: d.slug,
  }));
}

export default async function DetailServicePage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const service = dummyData.find(d => d.slug === slug);

  if (!service) {
    notFound();
  }

  return <DetailClient service={service} />;
}
