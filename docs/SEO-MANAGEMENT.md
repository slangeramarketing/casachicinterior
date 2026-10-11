# SEO Management: how it works, how to deploy it, how to use it

This document covers the dashboard-managed SEO system added to the Casa Chic
Interior site, the technical SEO fixes that shipped with it, and the steps to
deploy, verify and hand it over.

## 1. Architecture in one paragraph

One Next.js 16 (App Router) codebase serves both the public website
(`app/(public)`) and the admin dashboard (`app/(pwa)/admin`). There is no
separate API: public pages are Server Components that call the module facades
in `modules/*/*.server.ts` directly, and the dashboard writes through server
actions in `app/actions/*.action.ts`, which call the same facades. The facades
enforce the admin role, then call the service layer (business rules) and the
repository layer (Mongoose). MongoDB runs on the same Hostinger VPS as the app,
behind nginx and PM2. Every public page is rendered on demand
(`force-dynamic` in `app/(public)/layout.tsx`), so a change saved in the
dashboard is live on the next request.

## 2. From a keyword in the dashboard to the public page

1. An admin opens **Dashboard > SEO**, picks a page (for example About Us),
   fills in title, meta description, primary keyword, secondary keywords,
   optional heading override, robots directive, and sets the status to
   **Published**.
2. The form calls `createPageSeoAction` / `updatePageSeoAction`
   (`app/actions/seo.action.ts`).
3. The action calls `seoServer.create/update` (`modules/seo/seo.server.ts`),
   which checks the caller is an admin, then `seo.service.ts` normalises and
   validates the input (limits, allowed routes, URL shapes, one record per
   route) and `seo.repository.ts` writes the `pageseos` collection.
4. The action calls `revalidatePath` for the page, `/sitemap.xml` and the
   admin list. Pages are dynamic today so this is a no-op, but it keeps the
   behaviour correct if a page is ever switched to static or ISR rendering.
5. On the next request to that page, `generateMetadata` calls
   `seoServer.getPublishedForRoute("/about")`, which returns the record only
   if its status is `published`, and `buildPageMetadata()`
   (`lib/seo/buildPageMetadata.ts`) merges it with the page's hardcoded
   defaults field by field: title, description, keywords, canonical, robots,
   Open Graph and Twitter tags. The page body reads the same record (one DB
   lookup per request thanks to React `cache()`) to apply the H1 override.
6. The XML sitemap (`app/sitemap.ts`) reads the same records: a page whose
   published entry says `noindex` is left out, and `lastmod` is the entry's
   last update.

Fallbacks: no record, a draft/disabled record, or a database error all
result in the page's built-in metadata. A failure is logged on the server and
never turns the page into a 500.

## 3. Which pages can be managed

The registry is `lib/seo/managedPages.ts`:

| Route | Label | H1 override |
|---|---|---|
| `/` | Home | no (hero heading is designed content) |
| `/about` | About Us | yes |
| `/contact` | Contact | yes |
| `/services` | Services (listing) | yes |
| `/projects` | Projects (listing) | yes |
| `/blogs` | Blogs (listing) | yes |
| `/privacy-policy` | Privacy Policy | yes |
| `/terms-and-conditions` | Terms & Conditions | yes |
| `/site-map` | HTML Sitemap | yes |

Service pages, service categories, blog posts and blog categories are **not**
in this list on purpose: each already has its own SEO fields in its own
dashboard form (Service, Blogs), and allowing both would create two sources
of truth for one URL. The service rejects any route that is not in the
registry.

To add a page: add it to `MANAGED_PAGES`, then in the page's `generateMetadata`
call `buildPageMetadata({ route, siteUrl, seo, defaults })` and, if the H1
should be overridable, pass `seo?.heading` to the component that renders it.

## 4. Data model and validation

Collection `pageseos` (model `modules/seo/seo.model.ts`), one document per
route (unique index):

| Field | Rules |
|---|---|
| `route` | required, must be a managed route |
| `title` | up to 70 chars, required to publish |
| `description` | up to 170 chars, required to publish |
| `primaryKeyword` | up to 60 chars |
| `secondaryKeywords` | up to 20, each up to 60 chars, deduplicated case-insensitively, primary keyword removed automatically |
| `heading` | up to 120 chars, applied only on pages that support it |
| `canonicalUrl` | optional absolute http(s) URL; empty = derived from the site URL + route |
| `ogImage` | optional absolute URL or `/path` |
| `metaRobots` | `index, follow` (default), `noindex, follow`, `index, nofollow`, `noindex, nofollow` |
| `status` | `draft` (default), `published`, `disabled` |
| `updatedBy` | id of the admin who last saved |

All rules are enforced in `seo.service.ts` (server side); the form repeats
the cheap ones for instant feedback. The collection is created automatically
on first write. No migration touches existing data.

## 5. Rendering strategy

All metadata is in the initial HTML response. Search engines do not need to
run JavaScript to see titles, descriptions, canonicals, robots directives,
headings or structured data. Unknown slugs return real 404s (`notFound()`),
www and the two old domains 308-redirect to the bare `.com` domain, and
`http` is upgraded by nginx. `/sitemap.xml` and `/robots.txt` are generated
per request (`force-dynamic`), otherwise Next.js would freeze them at build
time, when the database is deliberately not connected.

## 6. Technical SEO fixes shipped in this branch

- Canonical tags: removed the root-level canonical that marked every page as
  a duplicate of the home page; each page now derives its own. The origin is
  `PUBLIC_SITE_URL` when it is a valid https URL (localhost and http are
  ignored in production), otherwise the request host, exactly as before.
  `NEXT_PUBLIC_BASE_URL` is not used for canonicals.
- Service detail pages: canonical, Open Graph URL and JSON-LD now point to
  the real route `/services/detail/<slug>` (the old `/services/<slug>` form
  returned 404). The services ItemList schema uses the same URLs.
- Invalid HTML: the public layout no longer renders a second `<html>` and
  `<body>` inside the root layout's.
- Titles/descriptions: unique defaults for home, about, contact and the
  listing pages; category pages use the category name as H1 instead of the
  generic listing heading.
- Headings: about and contact now have an H1 (same text, correct level).
- robots.txt added; `/admin`, `/auth`, `/api`, review-submission links and
  the static services preview are disallowed. The whole dashboard and login
  group is `noindex` through `app/(pwa)/layout.tsx`, and unauthenticated
  crawlers are redirected to the login page anyway.
- Sitemap: correct static routes (two dead URLs removed, services, projects,
  terms, site-map and category pages added), published-only dynamic routes,
  `lastmod` from the database, resilient to a failing data source.
- Structured data: LocalBusiness + WebSite on the home page, BreadcrumbList
  on blog, service and project detail pages (matching visible breadcrumbs),
  blog publisher logo fixed (was a missing file), service provider linked to
  the organisation by `@id`.
- Google verification tag now comes from `GOOGLE_SITE_VERIFICATION` instead
  of a hardcoded placeholder.
- Home page featured services are fetched on the server, so that content is
  in the initial HTML.
- Images: uploads wider than the limit (1920 px, 512 px for profiles) are
  resized and stored as WebP. Smaller uploads are converted only when WebP
  saves at least 10%, so images the dashboard already compressed in the
  browser are not re-compressed for nothing. Animated images, SVG and GIF
  are stored unchanged. Existing files can be compressed in place with
  `npm run optimize:uploads` (dry run) / `-- --apply`: PNG stays lossless,
  only files at least 15% smaller are rewritten, and backups go to a new
  timestamped folder under `~/casachic-upload-backups/` (outside `public/`).
- Home page LCP: the hero background was a 1.9 MB PNG in `public/assets`;
  it is now a 63 KB WebP with a 19 KB mobile candidate, preloaded with
  `fetchPriority="high"` (`components/public/landing-page/HeroSection.tsx`).
- Stock photos: every Unsplash URL in `lib/data/*.ts` and the listing heroes
  now requests a 1600 px, auto-format (WebP/AVIF) rendition instead of the
  multi-megabyte original.

### Measured effect (Lighthouse 12, mobile preset, headless Chrome, same laptop)

| Target | Performance | LCP | Page weight |
|---|---|---|---|
| Live site before deploy (2 runs) | 74, 71 | 21.7 s, 15.5 s | 8.5 MB |
| Local production build, before image fixes (2 runs) | 75, 75 | 14.3 s, 14.6 s | 8.3 MB |
| Local production build, after image fixes (2 runs) | 92, 97 | 3.3 s, 2.6 s | 1.5 MB |

Accessibility (88), Best Practices (100) and SEO (100) were unchanged
across runs. Local numbers are indicative only: no nginx compression, no
HTTPS, and a laptop instead of the VPS. Re-measure the live site with
PageSpeed Insights after deploying, and again after running the upload
optimiser on the server.

## 6a. Accessibility and Best Practices (Lighthouse)

Audited with Lighthouse on twelve public pages of the production build.
Accessibility scores before the fixes ranged from 77 (blog detail) to 89
(home); after the fixes every audited page scores 96 on Lighthouse 12 and
13, with colour contrast of the brand orange as the only failing audit.

Fixed in this branch:
- Footer "Contact Us" list: a link wrapped a list item instead of sitting inside it (failed both list audits on every page).
- Heading order: about-page value cards (h4 after h2), blog and project card titles (h3 directly under the h1), service highlight captions (now plain text, not headings).
- Blog share buttons had no accessible name and did nothing; they are now real share links to Facebook, X and LinkedIn with labels.
- Blog body images from the editor without alt text now get the post title as alt plus lazy loading (`lib/utils/htmlImages.ts`). Editors should still write real alt text when inserting images.
- Light grey text (gray-300/400, neutral-400) on white or light grey raised to gray-600/neutral-600 (contrast 6.8 to 7.8:1).
- Accessible names that contradicted the visible text (footer links, enquiry tab).
- Upload API now stores site-relative image paths (`/uploads/...`) instead of the uploading host's absolute URL, so content survives domain changes.

Remaining, needs a brand decision (every one of these is the brand orange):
- White text on orange `#F97316` / orange-500: contrast 2.8:1 (AA needs 4.5:1, or 3:1 for large text). Affects the header wordmark, buttons, badges, chips and the orange CTA boxes.
- Orange text on white or light backgrounds: 2.3 to 3.6:1. Affects eyebrow labels, highlighted heading words, category chips, project meta.

Options (ratios computed for white text):

| Option | Ratio | Visual change |
|---|---|---|
| Keep `#F97316` behind white text | 2.8 | none, audit keeps failing |
| Orange-700 `#C2410C` behind white text; orange-700 for small orange text | 5.2 | noticeably deeper orange |
| Custom `#C94A0A` | 4.7 | smallest shift that passes |
| Keep `#F97316` backgrounds, dark `#090F1A` text on them | 6.8 | dark-on-orange buttons |

The Lighthouse contrast audit is pass/fail per page, so the accessibility
score only reaches 100 once the orange decision is applied everywhere.

Best Practices: 100 in a clean browser profile with both Lighthouse 12 and
13. A lower score in a signed-in Chrome profile comes from third-party
cookies and DevTools issues attached to that profile, not from the site.
Some pages showed console errors locally only because the staging database
references images on the retired staging hostname.

## 7. Files added or changed

New:
- `modules/seo/` (constants, types, dto, model, repository, mapper, service,
  server, tests)
- `lib/seo/` (`siteConfig.ts`, `siteUrl.ts`, `managedPages.ts`,
  `buildPageMetadata.ts`, `jsonLd.ts`)
- `components/public/seo/` (`JsonLd.tsx`, `Breadcrumbs.tsx`)
- `components/public/about-page/AboutPageContent.tsx` (moved from the page so
  the page can export metadata)
- `components/admin/clientComponent/seo/` (`PageSeoList.tsx`, `PageSeoForm.tsx`)
- `app/(pwa)/admin/seo/` (list, create, `[id]` edit pages)
- `app/actions/seo.action.ts`
- `app/robots.ts`, `app/(public)/services/static/layout.tsx`
- `scripts/optimizeUploads.ts`, `.npmrc`

Changed:
- `app/layout.tsx`, `app/(public)/layout.tsx`, `app/sitemap.ts`,
  `next.config.ts`, `vitest.config.ts`, `package.json`
- Public pages: home, about, contact, services (+ category + detail),
  projects (+ detail), blogs (+ detail), privacy, terms, site-map,
  review submission
- Components: `ContactSection`, `PublicServicesList`, `PublicProjectList`,
  `PublicBlogListPage`, `PublicBlogDetail`, `PublicServiceDetail`,
  `PublicDetailProject`, `LandingPage`, admin `Sidebar`
- `app/api/uploads/route.ts` (image optimisation)
- `components/common/OptimizedImage.tsx` (`srcSet` pass-through),
  `components/public/landing-page/HeroSection.tsx` (WebP hero + preload),
  `public/assets/hero-wallpaper.webp` and `hero-wallpaper-768.webp` (new),
  `lib/data/projects.ts`, `lib/data/featuredProjects.ts` (sized stock photos)
- `app/(pwa)/layout.tsx`, `app/(pwa)/admin/home/page.tsx` (admin resilience
  fixes from the same branch)

## 8. Deployment

Environment variables (server `.env`, all existing ones unchanged):

| Variable | Required | Purpose |
|---|---|---|
| `PUBLIC_SITE_URL` | recommended: `https://casachicinterior.com` on production | canonical tags, sitemap, robots, Open Graph URLs and email banner links. Must be a full https URL; a missing, localhost, http or scheme-less value is ignored and the request host is used instead |
| `GOOGLE_SITE_VERIFICATION` | optional | emits the Search Console HTML-tag verification |
| `MONGODB_DB_NAME` | already set | database selection |

No database migration. The `pageseos` collection is created on first save.

Steps:
1. Merge the branch into `main` through a pull request. The build-check job
   runs on the pull request; the deploy job runs after merge.
2. Before or right after the deploy, check
   `grep -n SITE_URL /home/slangera/casachicinterior/.env`. It should read
   `PUBLIC_SITE_URL=https://casachicinterior.com`; add or correct it and run
   `pm2 restart casachic-basic --update-env`. If it is absent the site still
   works and uses the request host, as it did before this branch.
3. Verify (see section 10).
4. Optional, once: compress existing images on the server:
   `cd /home/slangera/casachicinterior && npm run optimize:uploads` (dry run),
   then `npm run optimize:uploads -- --apply`. Backups are written to a new
   timestamped folder under `~/casachic-upload-backups/`; restore a file by
   copying it back. Large PNG photos only shrink a little (lossless); for
   those, re-uploading through the dashboard stores a WebP.

Rollback: redeploy the previous commit (`git reset --hard <sha>` in the app
folder, rebuild, `pm2 restart casachic-basic`). The new collection can stay;
nothing else reads it.

## 9. Using it (for the client's team)

1. Log in to the dashboard and open **SEO** in the left menu. Every managed
   page is listed, with "not set up" for pages that still use their built-in
   text.
2. Click **Set up** (or **Edit**). Fill in:
   - **SEO title**: the headline in search results, ideally 50 to 60 characters.
   - **Meta description**: one or two sentences, up to 170 characters.
   - **Primary keyword**: the one phrase the page should rank for. Use it
     naturally in the title and description; it is not injected anywhere
     else.
   - **Secondary keywords**: related phrases, press Enter after each.
   - **Page heading override**: only if the visible main heading should change.
   - **Status**: leave as Draft while working, switch to **Published** to go
     live. **Disabled** keeps the entry but stops applying it.
   - Leave "Search engine directive", "Canonical URL override" and "Social
     share image" at their defaults unless you have a specific reason.
3. Save. Published changes are visible on the next page load. The search
   result preview in the form shows how it will look.
4. To verify, open the page, view the page source and check `<title>`,
   `<meta name="description">` and `<link rel="canonical">`, or use the URL
   Inspection tool in Google Search Console.
5. **Delete** returns the page to its built-in title and description.

Keyword guidance: one page, one primary topic. Do not repeat the same
keyword on several pages, and do not stuff keywords into descriptions;
Google rewrites descriptions it considers unnatural.

## 10. Search Console and verification

- Sitemap URL to submit: `https://casachicinterior.com/sitemap.xml`
- robots.txt: `https://casachicinterior.com/robots.txt`
- Verification: either keep the existing Google Tag Manager verification,
  or set `GOOGLE_SITE_VERIFICATION` to the code from the HTML-tag method.
- Inspect rendered HTML for any URL: Search Console > URL Inspection >
  View crawled page, or `curl -s <url> | grep -iE 'canonical|<title|robots'`.
- Validate structured data: https://validator.schema.org/ or Google's Rich
  Results Test with the page URL.
- Redirect check: `curl -sI https://www.casachicinterior.com/` should return
  308 to the bare domain after deploy.

## 11. Outstanding items that need client access

- Confirm `PUBLIC_SITE_URL` on the production server (SSH).
- Submit the sitemap and verify the domain in Google Search Console
  (client's Google account).
- Decide whether `/services/static` should be removed entirely (currently
  `noindex`).
- Rotate the credentials that are committed in the repository (`note.md`,
  `scripts/seedSuperAdmin.ts`) and the weak JWT secret on the server.
- Core Web Vitals field data needs real traffic; check Search Console's
  Core Web Vitals report a few weeks after deploy and run PageSpeed Insights
  on the home page once the existing images have been compressed.
