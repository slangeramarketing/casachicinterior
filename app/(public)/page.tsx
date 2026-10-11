/***************************************************
 * Server Page: app/(public)/page.tsx (Home)
 * - Metadata: dashboard-managed SEO entry for "/" with fallbacks.
 * - Structured data: LocalBusiness + WebSite (facts from siteConfig,
 *   which mirrors the footer/contact section).
 * - Featured services are fetched on the server so that content is
 *   present in the initial HTML for crawlers.
 ***************************************************/

import { Metadata } from "next";
import LandingPage from "@/components/public/landing-page/LandingPage";
import JsonLd from "@/components/public/seo/JsonLd";
import { reviewServer } from "@/modules/review/review.server";
import { serviceServer } from "@/modules/services/service.server";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/seo/siteConfig";

const ROUTE = "/";

export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: `${siteConfig.name} | Interior Designers in Noida & Delhi NCR`,
      description: siteConfig.description,
      keywords: [
        "interior designer noida",
        "home interior design delhi ncr",
        "modular kitchen noida",
        "casa chic interior",
      ],
    },
  });
}

export default async function HomePage() {
  const [siteUrl, reviewData, featuredServices] = await Promise.all([
    getSiteUrl(),
    reviewServer.getPublicFeaturedReviews(),
    serviceServer.getFeatured(5).catch((err: unknown) => {
      console.error("[Home] featured services unavailable:", err instanceof Error ? err.message : err);
      return [];
    }),
  ]);

  return (
    <div>
      <JsonLd data={[organizationJsonLd(siteUrl), websiteJsonLd(siteUrl)]} />
      <LandingPage reviews={reviewData} featuredServices={featuredServices} />
    </div>
  );
}
