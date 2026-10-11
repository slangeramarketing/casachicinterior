/*******************************************************
 * Server Page | Public Side
 * app/services/[slug]/page.tsx
 *******************************************************/

import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { serviceServer } from "@/modules/services/service.server";
import PublicServicesList from "@/components/public/service-page/PublicServiceList";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* -----------------------------------------------------------
   DYNAMIC SEO METADATA (MULTI-DOMAIN SAFE)
----------------------------------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = await getSiteUrl();

  const category = await serviceCategoryServer.getBySlug(slug);

  if (!category) {
    return {
      title: "Services | Casa Chic Interior",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = absoluteUrl(siteUrl, `/services/${category.slug}`);

  return {
    title: `${category.name} Services | Casa Chic Interior`,
    description:
      category.seo?.description ||
      `Explore our ${category.name} interior design services tailored to your needs.`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${category.name} Services`,
      description:
        category.seo?.description ||
        `Explore our ${category.name} interior design services.`,
      url: canonicalUrl,
      siteName: "Casa Chic Interior",
      type: "website",
    },
  };
}

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function ServiceCategoryPage(
  { params }: PageProps
) {
  const { slug } = await params;

  const category = await serviceCategoryServer.getBySlug(slug);
  if (!category) return notFound();

  // ✅ Public services under category
  const services = await serviceServer.getByCategory(category.id);

  return (
    <main className="w-full">
      {/* Unique H1 per category page instead of the generic listing heading */}
      <PublicServicesList
        services={services}
        heading={category.name}
        intro={category.description || undefined}
      />
    </main>
  );
}
