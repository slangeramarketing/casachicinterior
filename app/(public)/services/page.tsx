/**************************************************************************
 * Server Page: app/(public)/services/page.tsx
 * - Metadata: dashboard-managed SEO entry for "/services" with fallbacks.
 * - Structured data: ItemList of the published services, linking to the
 *   real detail route (/services/detail/<slug>).
 **************************************************************************/

import { Metadata } from "next";
import { serviceServer } from "@/modules/services/service.server";
import PublicServicesList from "@/components/public/service-page/PublicServiceList";
import JsonLd from "@/components/public/seo/JsonLd";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";

const ROUTE = "/services";

export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: "Interior Design Services | Casa Chic Interior",
      description:
        "Explore our professional interior design services. Home interiors, modular kitchens, renovations, and turnkey solutions tailored to your lifestyle.",
      keywords: [
        "interior design services",
        "home interior",
        "modular kitchen",
        "home renovation",
        "luxury interior designer",
        "Casa Chic Interior",
      ],
    },
  });
}

export default async function ServicesPage() {
  const [siteUrl, services, seo] = await Promise.all([
    getSiteUrl(),
    serviceServer.getPublic(),
    seoServer.getPublishedForRoute(ROUTE),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(siteUrl, `/services/detail/${service.slug}`),
      name: service.title,
    })),
  };

  return (
    <main className="w-full">
      <JsonLd data={jsonLd} />
      <PublicServicesList services={services} heading={seo?.heading || undefined} />
    </main>
  );
}
