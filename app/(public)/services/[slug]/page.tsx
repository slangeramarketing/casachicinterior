import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serviceServer } from "@/modules/services/service.server";
import PublicServiceDetail from "@/components/public/service-page/PublicServiceDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* -----------------------------------------------------------
   DYNAMIC SEO METADATA
----------------------------------------------------------- */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await serviceServer.getBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Casachicinterior" };
  }

  return {
    title: service.seo?.title || `${service.title} | Casachicinterior`,
    description: service.seo?.description || service.shortDescription,
    keywords: service.seo?.keywords || [],
    openGraph: {
      title: service.title,
      description: service.shortDescription,
      url: `https://casachicinterior.com/services/${slug}`,
      siteName: "Casachicinterior",
      images: [
        {
          url: service.seo?.ogImage || service.coverImage,
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
      images: [service.seo?.ogImage || service.coverImage],
    },
    alternates: {
      canonical: `https://casachicinterior.com/services/${slug}`,
    },
  };
}

/* -------------------------------------
    PAGE COMPONENT
------------------------------------- */
export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // Direct Server Facade Call
  const rawService = await serviceServer.getBySlug(slug);
  
  // Serialization Fix for Mongoose internal objects
  if (!rawService) return notFound();
  const service = JSON.parse(JSON.stringify(rawService));

  // JSON-LD Schema for Google (SEO Enhancement)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDescription,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Casachicinterior"
    },
    "areaServed": "Patna", // Apni city add karein
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": service.category?.name,
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": service.startingPrice,
      "description": `Starting from ₹${service.startingPrice} per ${service.priceUnit}`
    },
    "image": service.coverImage
  };

  return (
    <div className="w-full">
      {/* Schema Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <PublicServiceDetail service={service} />
    </div>
  );
}