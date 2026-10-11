/***************************************************
 * File: lib/seo/siteConfig.ts
 * Purpose:
 * - Single source of truth for brand-level SEO facts that are
 *   shared by metadata defaults and structured data (JSON-LD).
 * - Values are public business details already shown in the
 *   footer and contact section; keep them in sync with those.
 *
 * Restrictions:
 * - No secrets. No environment-specific URLs (see siteUrl.ts).
 ***************************************************/

export const siteConfig = {
  name: "Casa Chic Interior",
  legalName: "CasaChic Interior",
  description:
    "Casa Chic Interior designs and delivers modular kitchens, wardrobes, full-home interiors and office spaces across Noida and Delhi NCR, from concept to turnkey execution.",
  logoPath: "/assets/logoTransparent.png",
  defaultOgImagePath: "/assets/logoversion.png",
  telephone: "+91-8740990990",
  email: "contact@casachicinterior.com",
  address: {
    streetAddress: "Sector 62",
    addressLocality: "Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  serviceArea: "Delhi NCR",
  sameAs: [
    "https://www.facebook.com/share/p/17wLP8x3zK/",
    "https://www.instagram.com/casa.chic_interior",
  ],
} as const;
