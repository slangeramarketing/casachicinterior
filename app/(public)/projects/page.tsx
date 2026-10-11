/***************************************************
 * Server Page: app/(public)/projects/page.tsx
 ***************************************************/

import { Metadata } from "next";
import PublicProjectList from "@/components/public/project-page/PublicProjectList";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";

const ROUTE = "/projects";

export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: "Our Portfolio | Interior Design Projects | Casa Chic Interior",
      description:
        "Explore our award-winning interior design projects ranging from modern residential homes to premium commercial workspaces.",
      keywords: ["interior design portfolio", "interior design projects", "casa chic interior projects"],
    },
  });
}

export default async function PublicProjectListServer() {
  const seo = await seoServer.getPublishedForRoute(ROUTE);

  return (
    <div>
      <PublicProjectList heading={seo?.heading || undefined} />
    </div>
  );
}
