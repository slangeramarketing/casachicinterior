/***************************************************
 * Server Page: app/(public)/contact/page.tsx
 ***************************************************/

import { Metadata } from "next";
import ContactSection from "@/components/public/landing-page/ContactSection";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";

const ROUTE = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: "Contact Casa Chic Interior | Free Design Consultation in Noida",
      description:
        "Call, WhatsApp or send the form to book a free interior design consultation with Casa Chic Interior in Noida and Delhi NCR. We reply within 24 hours.",
      keywords: ["contact interior designer noida", "free interior design consultation", "casa chic interior contact"],
    },
  });
}

export default async function ContactPage() {
  const seo = await seoServer.getPublishedForRoute(ROUTE);

  return (
    <div>
      <ContactSection headingAs="h1" heading={seo?.heading || undefined} />
    </div>
  );
}
