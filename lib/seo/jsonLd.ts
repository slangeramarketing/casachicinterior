/***************************************************
 * File: lib/seo/jsonLd.ts
 * Purpose:
 * - Builders for schema.org JSON-LD blocks that describe things
 *   actually shown on the site (organisation details from the footer
 *   and contact section, visible breadcrumb trails).
 *
 * Restrictions:
 * - Only emit facts that are visible on the page or in site config.
 * - No I/O.
 ***************************************************/

import { siteConfig } from "./siteConfig";
import { absoluteUrl } from "./siteUrl";

export type JsonLdObject = Record<string, unknown>;

export function organizationId(siteUrl: string): string {
  return `${siteUrl}/#organization`;
}

/** LocalBusiness block for the home page. */
export function organizationJsonLd(siteUrl: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": organizationId(siteUrl),
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteUrl,
    logo: absoluteUrl(siteUrl, siteConfig.logoPath),
    image: absoluteUrl(siteUrl, siteConfig.defaultOgImagePath),
    description: siteConfig.description,
    telephone: siteConfig.telephone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    areaServed: siteConfig.serviceArea,
    sameAs: [...siteConfig.sameAs],
  };
}

/** WebSite block for the home page. */
export function websiteJsonLd(siteUrl: string): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteConfig.name,
    url: siteUrl,
    publisher: { "@id": organizationId(siteUrl) },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/blogs". The last item may omit it. */
  path?: string;
}

/** BreadcrumbList matching a visible <Breadcrumbs /> trail. */
export function breadcrumbJsonLd(siteUrl: string, items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: absoluteUrl(siteUrl, item.path) } : {}),
    })),
  };
}

/** FAQPage block. Only use when the same questions are visible on the page. */
export function faqPageJsonLd(faqs: Array<{ question: string; answer: string }>): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export interface AreaServiceInput {
  slug: string;
  title: string;
  description: string;
  areaName: string;
  localities: string[];
  image?: string;
}

/**
 * Service block for an area landing page: the organisation provides
 * interior design in this area and its localities. One Service per
 * area (not one LocalBusiness per area, which would misrepresent a
 * single business as several).
 */
export function areaServiceJsonLd(siteUrl: string, input: AreaServiceInput): JsonLdObject {
  const url = absoluteUrl(siteUrl, `/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: input.title,
    description: input.description,
    serviceType: "Interior design",
    url,
    ...(input.image ? { image: absoluteUrl(siteUrl, input.image) } : {}),
    provider: { "@id": organizationId(siteUrl) },
    areaServed: [
      { "@type": "Place", name: input.areaName },
      ...input.localities.map((l) => ({ "@type": "Place", name: `${l}, ${input.areaName}` })),
    ],
  };
}

/** Serialise for a <script type="application/ld+json"> without allowing </script> breakout. */
export function serializeJsonLd(data: JsonLdObject | JsonLdObject[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
