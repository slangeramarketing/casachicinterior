/***************************************************
 * File: modules/locations/location.constants.ts
 * Layer: Constants
 *
 * Purpose:
 * - Limits and enumerations for area/location landing pages
 *   (e.g. /interior-designers-in-noida).
 * - The "to publish" minimums exist so every location page carries
 *   genuinely local content. Pages that only swap the city name are
 *   treated by Google as doorway pages and can hurt the whole site.
 ***************************************************/

import { META_ROBOTS_OPTIONS } from "@/modules/seo/seo.constants";

export const LOCATION_LIMITS = {
  SLUG_MAX: 80,
  AREA_NAME_MAX: 60,
  TITLE_MAX: 120,
  INTRO_MAX: 6000,
  /** Characters of area-specific intro text required before publishing. */
  INTRO_MIN_TO_PUBLISH: 200,
  LOCALITIES_MAX: 40,
  LOCALITY_MAX_LENGTH: 60,
  /** Localities/sectors served required before publishing. */
  LOCALITIES_MIN_TO_PUBLISH: 3,
  SERVICES_MAX: 20,
  PROJECTS_MAX: 12,
  BUDGETS_MAX: 10,
  TESTIMONIALS_MAX: 12,
  FAQS_MAX: 20,
  /** Area-specific FAQs required before publishing. */
  FAQS_MIN_TO_PUBLISH: 3,
  SHORT_TEXT_MAX: 160,
  LONG_TEXT_MAX: 2000,
  META_TITLE_MAX: 70,
  META_DESCRIPTION_MAX: 170,
  KEYWORDS_MAX_COUNT: 20,
  KEYWORD_MAX_LENGTH: 60,
  CTA_TEXT_MAX: 60,
} as const;

export const LOCATION_STATUSES = ["draft", "published", "disabled"] as const;

export const LOCATION_META_ROBOTS_OPTIONS = META_ROBOTS_OPTIONS;
export const DEFAULT_LOCATION_META_ROBOTS = "index, follow";

export const DEFAULT_LOCATION_CTA_TEXT = "Book a Free Consultation";
export const DEFAULT_LOCATION_CTA_LINK = "/contact";

/**
 * Location pages live at the site root (/<slug>), so a slug must never
 * shadow an existing route or a reserved path. Static routes win in
 * Next.js anyway, but a location saved with one of these slugs would
 * simply be unreachable, so the service rejects them up front.
 */
export const RESERVED_LOCATION_SLUGS: readonly string[] = [
  "about",
  "admin",
  "api",
  "assets",
  "auth",
  "blog",
  "blogs",
  "contact",
  "favicon.ico",
  "index.html",
  "location",
  "locations",
  "manifest.json",
  "privacy-policy",
  "projects",
  "review",
  "robots.txt",
  "services",
  "site-map",
  "sitemap",
  "sitemap.xml",
  "sw.js",
  "terms-and-conditions",
  "terms-of-service",
  "uploads",
];
