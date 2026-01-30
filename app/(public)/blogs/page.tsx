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
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

/* -----------------------------------------------------------
   SEO METADATA
----------------------------------------------------------- */
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = await getBaseUrl();
  const canonicalUrl = `${baseUrl}/blogs`;

  return {
    title: "Interior Design Blogs | Casa Chic Interior",
    description:
      "Explore expert interior design blogs, tips, trends, and renovation guides by Casa Chic Interior.",
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: "Interior Design Blogs | Casa Chic Interior",
      description:
        "Latest interior design ideas, tips, trends, and home renovation insights.",
      url: canonicalUrl,
      siteName: "Casa Chic Interior",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Interior Design Blogs | Casa Chic Interior",
      description:
        "Read expert blogs on interior design, modular kitchens, home renovation, and décor trends.",
    },
  };
}

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function BlogsServerPage() {
  const result = await blogServer.getAll();
  const blogCategoryList = await blogCategoryServer.getList();

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
      />
    </main>
  );
}
