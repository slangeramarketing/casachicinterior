/*******************************************************
 * Server Page: app/services/[slug]/page.tsx
 *******************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceServer } from "@/modules/services/service.server";
import PublicServiceDetail from "@/components/public/service-page/PublicServiceDetail";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* -----------------------------------------------------------
   DYNAMIC SEO METADATA (MULTI-DOMAIN SAFE)
----------------------------------------------------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const {slug}=await params;
  const baseUrl = await getBaseUrl();
  const service = await serviceServer.getBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | Casa Chic Interior",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = `${baseUrl}/services/${service.slug}`;
  const ogImage = service.seo?.ogImage || service.coverImage;

  return {
    title: service.seo?.title || `${service.title} | Casa Chic Interior`,
    description:
      service.seo?.description || service.shortDescription,
    keywords: service.seo?.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: service.title,
      description: service.shortDescription,
      url: canonicalUrl,
      siteName: "Casa Chic Interior",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
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

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function ServiceDetailPage({ params }: PageProps) {
  const {slug}=await params
  const baseUrl = await getBaseUrl();
  const service = await serviceServer.getBySlug(slug);

  if (!service) return notFound();

  /* -----------------------------------------------------------
     JSON-LD (Service Schema)
  ----------------------------------------------------------- */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    image: service.coverImage,
    url: `${baseUrl}/services/${service.slug}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Casa Chic Interior",
      url: baseUrl,
    },
    areaServed: {
      "@type": "City",
      name: "Patna",
    },
    hasOfferCatalog: service.category?.name
      ? {
          "@type": "OfferCatalog",
          name: service.category.name,
        }
      : undefined,
    offers: service.startingPrice
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          price: service.startingPrice,
          description: `Starting from ₹${service.startingPrice} per ${service.priceUnit}`,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <div className="w-full">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <PublicServiceDetail service={service} />
    </div>
  );
}
