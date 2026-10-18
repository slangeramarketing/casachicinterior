/***************************************************
 * Server Page: app/(public)/[locationSlug]/page.tsx
 * - Area landing pages managed from Dashboard > Locations, served at
 *   the site root (e.g. /interior-designers-in-noida).
 * - Static routes (about, services, ...) take precedence in Next.js,
 *   and the service also rejects those slugs, so there is no overlap.
 * - Unknown or unpublished slugs return a real 404.
 ***************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationPage from "@/components/public/location-page/LocationPage";
import JsonLd from "@/components/public/seo/JsonLd";
import { locationServer } from "@/modules/locations/location.server";
import { serviceServer } from "@/modules/services/service.server";
import { ServiceResponseDTO } from "@/modules/services/service.dto";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { areaServiceJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/seo/siteConfig";

interface Props {
  params: Promise<{ locationSlug: string }>;
}

function summarize(text: string, max = 160): string {
  const firstParagraph = text.split(/\n\s*\n/)[0]?.replace(/\s+/g, " ").trim() ?? "";
  if (firstParagraph.length <= max) return firstParagraph;
  return `${firstParagraph.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = await locationServer.getPublishedBySlug(locationSlug);

  if (!location) {
    return { title: "Page Not Found", robots: { index: false, follow: false } };
  }

  const siteUrl = await getSiteUrl();
  const [primaryKeyword, ...secondaryKeywords] = location.keywords;

  return buildPageMetadata({
    route: `/${location.slug}`,
    siteUrl,
    defaults: {
      title: `${location.title} | ${siteConfig.name}`,
      description: summarize(location.intro) || siteConfig.description,
      keywords: location.keywords,
      ogImage: location.heroImage || undefined,
    },
    seo: {
      status: "published",
      title: location.metaTitle,
      description: location.metaDescription,
      primaryKeyword,
      secondaryKeywords,
      ogImage: location.heroImage,
      metaRobots: location.metaRobots,
    },
  });
}

/** Selected services in the admin's order; featured services when none are selected. */
async function loadServices(serviceIds: string[]): Promise<ServiceResponseDTO[]> {
  try {
    if (serviceIds.length === 0) return await serviceServer.getFeatured(3);
    const all = await serviceServer.getPublic();
    const byId = new Map(all.map((s) => [s.id, s]));
    return serviceIds.map((id) => byId.get(id)).filter((s): s is ServiceResponseDTO => !!s);
  } catch (err) {
    console.error("[Location page] services unavailable:", err instanceof Error ? err.message : err);
    return [];
  }
}

export default async function LocationLandingPage({ params }: Props) {
  const { locationSlug } = await params;
  const location = await locationServer.getPublishedBySlug(locationSlug);
  if (!location) notFound();

  const [siteUrl, services] = await Promise.all([getSiteUrl(), loadServices(location.serviceIds)]);

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: location.areaName },
  ];

  const jsonLd = [
    areaServiceJsonLd(siteUrl, {
      slug: location.slug,
      title: location.title,
      description: location.metaDescription || summarize(location.intro),
      areaName: location.areaName,
      localities: location.localities,
      image: location.heroImage || undefined,
    }),
    breadcrumbJsonLd(siteUrl, breadcrumbs),
    ...(location.faqs.length ? [faqPageJsonLd(location.faqs)] : []),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <LocationPage
        location={location}
        services={services}
        breadcrumbs={breadcrumbs.map((b) => ({ name: b.name, href: b.path }))}
      />
    </>
  );
}
