/***************************************************
 * File: lib/seo/legacySlugs.ts
 * Purpose:
 * - Map old URL slugs to their replacements so links that Google (or
 *   other sites) still hold keep working with a permanent redirect.
 * - Used by the service-category page as a last resort, only when a
 *   slug no longer matches a category or a service. Until the slug is
 *   actually renamed in the dashboard/database the old URL therefore
 *   keeps serving the page as before, so the rename can happen at any
 *   time after deploy without a 404 window.
 *
 * Adding an entry: when a category slug is renamed, add
 *   "<old-slug>": "<new-slug>"
 ***************************************************/

export const LEGACY_SERVICE_CATEGORY_SLUGS: Readonly<Record<string, string>> = {
  // Category was created with a typo in Jan 2026; renamed Oct 2026.
  "commercial-inrerior": "commercial-interior",
};

export function resolveLegacyCategorySlug(slug: string): string | null {
  const target = LEGACY_SERVICE_CATEGORY_SLUGS[slug.toLowerCase()];
  return target && target !== slug ? target : null;
}
