/**************************************************************************
 * Server Page: app/services/page.tsx
 **************************************************************************/

import { Metadata } from "next";
import { serviceServer } from "@/modules/services/service.server";
import PublicServicesList from "@/components/public/service-page/PublicServiceList";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

/* -----------------------------------------------------------
   DYNAMIC SEO METADATA (MULTI-DOMAIN SAFE)
----------------------------------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();

  return {
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
    alternates: {
      canonical: `${baseUrl}/services`,
    },
    openGraph: {
      title: "Interior Design Services | Casa Chic Interior",
      description:
        "From concept to completion — discover our complete range of interior design services.",
      url: `${baseUrl}/services`,
      siteName: "Casa Chic Interior",
      images: [
        {
          url: `${baseUrl}/og/services.jpg`, // fallback OG image
          width: 1200,
          height: 630,
          alt: "Casa Chic Interior Services",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Interior Design Services | Casa Chic Interior",
      description:
        "Luxury interior design services for homes and offices.",
      images: [`${baseUrl}/og/services.jpg`],
    },
  };
}

/* -----------------------------------------------------------
   ISR
----------------------------------------------------------- */
export const revalidate = 3600; // 1 hour

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function ServicesPage() {
  const baseUrl = await getBaseUrl();
  const services = await serviceServer.getPublic();

  /* JSON-LD: Service Listing */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${baseUrl}/services/${service.slug}`,
      name: service.title,
    })),
  };

  return (
    <main className="w-full">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PublicServicesList services={services} />
    </main>
  );
}
