/*******************************************************
 * Server Page: app/(public)/services/detail/[slug]/page.tsx
 * - Metadata comes from the service's own SEO fields (edited in the
 *   dashboard under Service), with sensible fallbacks.
 * - Canonical, Open Graph and JSON-LD all point at THIS route
 *   (/services/detail/<slug>); the previous /services/<slug> form
 *   resolved to the category page and returned 404.
 * - Unknown slugs return a real 404 via notFound().
 *******************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceServer } from "@/modules/services/service.server";
import PublicServiceDetail from "@/components/public/service-page/PublicServiceDetail";
import JsonLd from "@/components/public/seo/JsonLd";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { breadcrumbJsonLd, faqPageJsonLd, organizationId } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/seo/siteConfig";
import { parseMetaRobots } from "@/lib/seo/buildPageMetadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const detailPath = (slug: string) => `/services/detail/${slug}`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [siteUrl, service] = await Promise.all([getSiteUrl(), serviceServer.getBySlug(slug)]);

  if (!service) {
    return {
      title: "Service Not Found | Casa Chic Interior",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = absoluteUrl(siteUrl, detailPath(service.slug));
  const ogImage = absoluteUrl(siteUrl, service.seo?.ogImage || service.coverImage || siteConfig.defaultOgImagePath);
  const title = service.seo?.title || `${service.title} | Casa Chic Interior`;
  const description = service.seo?.description || service.shortDescription;
  const robots = parseMetaRobots(service.seo?.metaRobots);

  return {
    title,
    description,
    keywords: service.seo?.keywords || [],
    alternates: { canonical: canonicalUrl },
    robots: { index: robots.index, follow: robots.follow },
    openGraph: {
      title: service.title,
      description: service.shortDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: service.title }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.title,
      description: service.shortDescription,
      images: [ogImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [siteUrl, service] = await Promise.all([getSiteUrl(), serviceServer.getBySlug(slug)]);

  if (!service) return notFound();

  const pageUrl = absoluteUrl(siteUrl, detailPath(service.slug));

  const visibleFaqs = (service.faqs ?? []).filter((f) => f.question?.trim() && f.answer?.trim());

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    image: absoluteUrl(siteUrl, service.coverImage),
    url: pageUrl,
    provider: {
      "@type": "LocalBusiness",
      "@id": organizationId(siteUrl),
      name: siteConfig.name,
      url: siteUrl,
    },
    areaServed: siteConfig.serviceArea,
    ...(service.category?.name
      ? { hasOfferCatalog: { "@type": "OfferCatalog", name: service.category.name } }
      : {}),
    ...(service.startingPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            price: service.startingPrice,
            description: `Starting from ₹${service.startingPrice} per ${service.priceUnit}`,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    ...(service.category?.slug
      ? [{ name: service.category.name, path: `/services/${service.category.slug}` }]
      : []),
    { name: service.title },
  ];

  return (
    <div className="w-full">
      {/* FAQPage schema only for FAQs that are visibly rendered on this page. */}
      <JsonLd
        data={[
          serviceJsonLd,
          breadcrumbJsonLd(siteUrl, breadcrumbs),
          ...(visibleFaqs.length ? [faqPageJsonLd(visibleFaqs)] : []),
        ]}
      />
      <PublicServiceDetail
        service={service}
        breadcrumbs={breadcrumbs.map((b) => ({ name: b.name, href: b.path }))}
      />
    </div>
  );
}
