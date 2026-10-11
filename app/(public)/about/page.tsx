/***************************************************
 * Server Page: app/(public)/about/page.tsx
 * - Metadata comes from the dashboard-managed SEO entry for "/about"
 *   with the hardcoded values below as fallback.
 * - The animated content lives in a Client Component.
 ***************************************************/

import { Metadata } from "next";
import AboutPageContent from "@/components/public/about-page/AboutPageContent";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { aboutData } from "@/lib/data/about";

const ROUTE = "/about";

export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: "About Casa Chic Interior | Interior Design Studio in Noida",
      description:
        "Meet Casa Chic Interior: a Noida based interior design studio delivering personalised, functional and timeless homes and workspaces across Delhi NCR.",
      keywords: ["about casa chic interior", "interior design studio noida", aboutData.brand],
    },
  });
}

export default async function AboutPage() {
  const seo = await seoServer.getPublishedForRoute(ROUTE);
  return <AboutPageContent heading={seo?.heading || undefined} />;
}
