/**************************************************************************
 * Blog Detail Page: app/blogs/[slug]/page.tsx
 **************************************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import PublicBlogDetail from "@/components/public/blogs-page/PublicBlogDetail";
import { getBaseUrl } from "@/lib/utils/getBaseUrl";

interface Props {
  params: Promise<{ slug: string }>;
}

/* -----------------------------------------------------------
   DYNAMIC SEO METADATA
----------------------------------------------------------- */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = await getBaseUrl();

  const blogRes = await blogServer.getBySlug(slug);

  if (!blogRes.success || !blogRes.data) {
    return {
      title: "Blog Not Found | Casa Chic Interior",
      robots: { index: false, follow: false },
    };
  }

  const blog = blogRes.data;
  const canonicalUrl = `${baseUrl}/blogs/${blog.slug}`;

  return {
    title:
      blog.seo?.metaTitle ||
      `${blog.title} | Casa Chic Interior`,
    description:
      blog.seo?.metaDescription ||
      blog.summary ||
      blog.title,
    keywords: blog.seo?.keywords || [],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description:
        blog.summary ||
        blog.seo?.metaDescription ||
        "",
      url: canonicalUrl,
      siteName: "Casa Chic Interior",
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.updatedAt,
      images: [
        {
          url:
            blog.seo?.ogImage ||
            blog.bannerImage ||
            blog.thumbnail ||
            "",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description:
        blog.summary ||
        blog.seo?.metaDescription ||
        "",
      images: [
        blog.seo?.ogImage ||
          blog.bannerImage ||
          blog.thumbnail ||
          "",
      ],
    },
    robots: {
      index: blog.status === "published",
      follow: true,
    },
  };
}

/* -----------------------------------------------------------
   PAGE
----------------------------------------------------------- */
export default async function SingleBlogServerPage({ params }: Props) {
  const { slug } = await params;

  // 1️⃣ Fetch main blog
  const blogRes = await blogServer.getBySlug(slug);

  if (!blogRes.success || !blogRes.data) {
    notFound();
  }

  const blogData = blogRes.data;

  // 2️⃣ Fetch related blogs (same category, exclude current)
  const relatedRes = await blogServer.getAll({
    categoryId: blogData.category.id,
    status: "published",
    _id: { $ne: blogData.id },
  });

  const relatedBlogs =
    relatedRes.success && Array.isArray(relatedRes.data)
      ? relatedRes.data.slice(0, 4)
      : [];

  /* -------------------------------------------------------
     JSON-LD (Article Schema)
  ------------------------------------------------------- */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogData.title,
    description:
      blogData.summary ||
      blogData.seo?.metaDescription ||
      "",
    image:
      blogData.seo?.ogImage ||
      blogData.bannerImage ||
      blogData.thumbnail ||
      "",
    datePublished: blogData.publishedAt,
    dateModified: blogData.updatedAt,
    author: {
      "@type": "Person",
      name: blogData.author?.name || "Casa Chic Interior",
    },
    publisher: {
      "@type": "Organization",
      name: "Casa Chic Interior",
      logo: {
        "@type": "ImageObject",
        url: `${await getBaseUrl()}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${await getBaseUrl()}/blogs/${blogData.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <PublicBlogDetail
        blog={blogData}
        relatedBlogs={relatedBlogs}
      />
    </div>
  );
}
