/***************************************************
 * File: lib/seo/managedPages.ts
 * Purpose:
 * - Registry of the static public routes whose SEO can be managed
 *   from the dashboard (modules/seo).
 * - Dynamic entity pages (services, blogs, categories) are NOT
 *   listed here on purpose: they carry their own SEO fields in
 *   their own modules, and allowing both would create conflicting
 *   mappings for the same URL.
 *
 * Adding a page: add it here, then read its record in the page's
 * generateMetadata via buildPageMetadata().
 ***************************************************/

export interface ManagedPage {
  route: string;
  label: string;
  /** Whether the page's primary heading can be overridden from the dashboard. */
  supportsHeading: boolean;
}

export const MANAGED_PAGES: readonly ManagedPage[] = [
  { route: "/", label: "Home", supportsHeading: false },
  { route: "/about", label: "About Us", supportsHeading: true },
  { route: "/contact", label: "Contact", supportsHeading: true },
  { route: "/services", label: "Services (listing)", supportsHeading: true },
  { route: "/projects", label: "Projects (listing)", supportsHeading: true },
  { route: "/blogs", label: "Blogs (listing)", supportsHeading: true },
  { route: "/privacy-policy", label: "Privacy Policy", supportsHeading: true },
  { route: "/terms-and-conditions", label: "Terms & Conditions", supportsHeading: true },
  { route: "/site-map", label: "HTML Sitemap", supportsHeading: true },
] as const;

export const MANAGED_ROUTES: readonly string[] = MANAGED_PAGES.map((p) => p.route);

export function isManagedRoute(route: string): boolean {
  return MANAGED_ROUTES.includes(route);
}

export function getManagedPage(route: string): ManagedPage | undefined {
  return MANAGED_PAGES.find((p) => p.route === route);
}
