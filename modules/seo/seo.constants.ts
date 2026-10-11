/***************************************************
 * File: modules/seo/seo.constants.ts
 * Layer: Constants
 *
 * Purpose:
 * - Validation limits and enumerations for page SEO records.
 * - Limits follow common search-result display budgets; they are
 *   enforced server-side so the dashboard cannot bypass them.
 ***************************************************/

export const SEO_LIMITS = {
  TITLE_MAX: 70,
  DESCRIPTION_MAX: 170,
  HEADING_MAX: 120,
  KEYWORD_MAX_LENGTH: 60,
  KEYWORDS_MAX_COUNT: 20,
  URL_MAX_LENGTH: 500,
} as const;

export const PAGE_SEO_STATUSES = ["draft", "published", "disabled"] as const;

export const META_ROBOTS_OPTIONS = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
] as const;

export const DEFAULT_META_ROBOTS = "index, follow";
