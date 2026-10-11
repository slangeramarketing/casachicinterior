/**************************************************************************
 * Blog Detail Page: app/blogs/[slug]/page.tsx
 **************************************************************************/

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import PublicBlogDetail from "@/components/public/blogs-page/PublicBlogDetail";
import JsonLd from "@/components/public/seo/JsonLd";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/siteUrl";
import { breadcrumbJsonLd, organizationId } from "@/lib/seo/jsonLd";
import { siteConfig } from "@/lib/seo/siteConfig";
import { withImageDefaults } from "@/lib/utils/htmlImages";

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
  const siteUrl = await getSiteUrl();

  const blogRes = await blogServer.getBySlug(slug);

  if (!blogRes.success || !blogRes.data) {
    return {
      title: "Blog Not Found | Casa Chic Interior",
      robots: { index: false, follow: false },
    };
  }

  const blog = blogRes.data;
  const canonicalUrl = absoluteUrl(siteUrl, `/blogs/${blog.slug}`);
  // New uploads are stored as site-relative paths; social and search
  // previews need absolute URLs.
  const ogImage = absoluteUrl(
    siteUrl,
    blog.seo?.ogImage || blog.bannerImage || blog.thumbnail || siteConfig.defaultOgImagePath
  );

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
          url: ogImage,
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
      images: [ogImage],
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

  const blogData = {
    ...blogRes.data,
    // Editor content may contain images without alt text; fall back to the post title.
    content: withImageDefaults(blogRes.data.content, blogRes.data.title),
  };
  const siteUrl = await getSiteUrl();

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
    image: absoluteUrl(
      siteUrl,
      blogData.seo?.ogImage ||
        blogData.bannerImage ||
        blogData.thumbnail ||
        siteConfig.defaultOgImagePath
    ),
    datePublished: blogData.publishedAt,
    dateModified: blogData.updatedAt,
    author: {
      "@type": "Person",
      name: blogData.author?.name || "Casa Chic Interior",
    },
    publisher: {
      "@type": "Organization",
      "@id": organizationId(siteUrl),
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(siteUrl, siteConfig.logoPath),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(siteUrl, `/blogs/${blogData.slug}`),
    },
  };

  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: "Blogs", path: "/blogs" },
    { name: blogData.title },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <JsonLd data={breadcrumbJsonLd(siteUrl, breadcrumbs)} />

      <PublicBlogDetail
        blog={blogData}
        relatedBlogs={relatedBlogs}
        breadcrumbs={breadcrumbs.map((b) => ({ name: b.name, href: b.path }))}
        shareUrl={absoluteUrl(siteUrl, `/blogs/${blogData.slug}`)}
      />
    </div>
  );
}
