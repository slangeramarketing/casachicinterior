"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import SearchInput from "@/components/common/SearchInput";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import { getBlogBySlugAction } from "@/app/admin/actions/admin.blogs.action";

export default function SingleBlogPage() {
  const { slug } = useParams<{ slug: string }>();

  console.log("SLUG: ",slug);

  /* =========================
      STATES
  ========================= */
  const [currentBlog, setCurrentBlog] = useState<BlogResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ===============================
      Fetch Blog Data By Slug
  ================================== */
  useEffect(() => {
    async function loadBlog() {
      if (!slug) return;
      
      try {
        setLoading(true);
        const blog = await getBlogBySlugAction(slug);
        
        if (blog) {
          setCurrentBlog(blog);
        } else {
          setError("Blog post not found.");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Failed to load the blog post.");
      } finally {
        setLoading(false);
      }
    }

    loadBlog();
  }, [slug]);

  /* =========================
      CONDITIONAL RENDERING
  ========================= */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded mb-8"></div>
          <div className="h-4 w-full bg-gray-100 mb-2"></div>
          <div className="h-4 w-full bg-gray-100 mb-2"></div>
        </div>
      </div>
    );
  }

  if (error || !currentBlog) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-2xl font-bold text-red-500">{error || "Blog not found"}</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10">
        
        {/* ================= LEFT CONTENT (Article) ================= */}
        <main>
          <article>
            {/* Category Name (Populated) */}
            {currentBlog.category && (
              <span className="text-orange-500 text-sm font-semibold uppercase tracking-wider">
                {currentBlog.category.name}
              </span>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-2 leading-tight text-gray-900">
              {currentBlog.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed italic border-l-4 border-orange-400 pl-4">
              {currentBlog.description}
            </p>

            {currentBlog.thumbnailImage && (
              <div className="relative w-full aspect-video mb-10 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src={currentBlog.thumbnailImage}
                  alt={currentBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Rich Text Body */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: currentBlog.richText || "" }}
            />
          </article>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="space-y-8">
          {/* SEARCH (Optional UI - Just Placeholder now) */}
          <SearchInput
            placeholder="Search blogs..."
            onChange={(val) => console.log("Searching for:", val)}
          />

          {/* BLOG META INFO */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 text-lg">Post Details</h3>
            <div className="space-y-3 text-sm">
              <p className="flex justify-between text-gray-600">
                <span className="font-medium text-gray-400">Published:</span>
                <span>{currentBlog.publishedAt ? new Date(currentBlog.publishedAt).toLocaleDateString() : "Draft"}</span>
              </p>
              {currentBlog.subCategory && (
                <p className="flex justify-between text-gray-600">
                  <span className="font-medium text-gray-400">Sub-Category:</span>
                  <span className="text-blue-600 font-semibold">{currentBlog.subCategory.name}</span>
                </p>
              )}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}