/**************************************************************************
 * Blog Page: app/blogs/page.tsx
 * Purpose:
 * - Public blog listing
 * - SEO optimized
 * - Multi-domain safe
 **************************************************************************/

import { Metadata } from "next";
import PublicBlogListPage from "@/components/public/blogs-page/PublicBlogListPage";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";
import { blogServer } from "@/modules/blogs/blog.server";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { seoServer } from "@/modules/seo/seo.server";
import { buildPageMetadata } from "@/lib/seo/buildPageMetadata";
import { getSiteUrl } from "@/lib/seo/siteUrl";

const ROUTE = "/blogs";

/* -----------------------------------------------------------
   SEO METADATA (dashboard-managed entry with fallbacks)
----------------------------------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const [siteUrl, seo] = await Promise.all([getSiteUrl(), seoServer.getPublishedForRoute(ROUTE)]);

  return buildPageMetadata({
    route: ROUTE,
    siteUrl,
    seo,
    defaults: {
      title: "Interior Design Blogs | Casa Chic Interior",
      description:
        "Explore expert interior design blogs, tips, trends, and renovation guides by Casa Chic Interior.",
      keywords: ["interior design blog", "home decor tips", "modular kitchen ideas", "home renovation guide"],
    },
  });
}

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function BlogsServerPage() {
  const [result, blogCategoryList, seo] = await Promise.all([
    blogServer.getAll(),
    blogCategoryServer.getList(),
    seoServer.getPublishedForRoute(ROUTE),
  ]);

  // ✅ Blogs always array
  const blogs: BlogResponseDTO[] =
    result.success ? result.data : [];

  // ✅ Categories always array
  const categories: BlogCategoryResponseDTO[] =
    blogCategoryList.success ? blogCategoryList.data : [];

  if (!result.success) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading blogs: {result.error}
      </div>
    );
  }

  return (
    <main className="w-full">
      <PublicBlogListPage
        blogs={blogs}
        categories={categories}
        heading={seo?.heading || undefined}
      />
    </main>
  );
}
