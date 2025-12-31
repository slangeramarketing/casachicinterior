"use client";

import { useEffect, useMemo, useState } from "react";
import SearchInput from "@/components/common/SearchInput";
import CategoryChipGroup from "@/components/public/CategoryChipGroup";
import BlogCard from "@/components/admin/BlogCard";
import { timeAgo } from "@/lib/utils/timeAgo";
import { BlogData } from "@/lib/data/blogs/blog.data";
import { PageRouteHeader } from "@/components/common/PageHeader";

type ViewMode = "article" | "results";

interface SingleBlogProps {
  blogs: BlogData[];
  slug: string;
}

export default function SingleBlog({ blogs, slug }: SingleBlogProps) {
  /* =========================
     STATES
  ========================= */
  const [currentBlog, setCurrentBlog] = useState<BlogData | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("article");

  /* =========================
     INITIAL BLOG LOAD
  ========================= */
  useEffect(() => {
    const found = blogs.find((b) => b.slug === slug);
    setCurrentBlog(found || null);
    setViewMode("article");
  }, [slug, blogs]);

  /* =========================
     FILTERED BLOGS
  ========================= */
  const filteredBlogs = useMemo(() => {
    let data = [...blogs];

    if (activeCategory && activeCategory !== "All") {
      data = data.filter(
        (blog) =>
          blog.subCategory.toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (blog) =>
          blog.title.toLowerCase().includes(q) ||
          blog.description.toLowerCase().includes(q)
      );
    }

    return data;
  }, [blogs, search, activeCategory]);

  const categories = ["All", "Living Room", "Bedroom", "Kitchen", "Bathroom"];

  if (!currentBlog) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Blog not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-10">

        {/* ================= LEFT CONTENT ================= */}
        <div>

          {/* ARTICLE VIEW */}
          {viewMode === "article" && (
            <article>
              <h1 className="text-4xl font-bold mb-4">
                {currentBlog.title}
              </h1>

              <p className="text-gray-600 mb-6">
                {currentBlog.description}
              </p>

              <img
                src={currentBlog.thumbnailImage}
                alt={currentBlog.title}
                className="w-full rounded-lg mb-8"
              />

              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                  __html: currentBlog.richText,
                }}
              />
            </article>
          )}

          {/* SEARCH RESULTS */}
          {viewMode === "results" && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results
              </h2>

              {filteredBlogs.length === 0 && (
                <p className="text-gray-500">No blogs found</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="cursor-pointer"
                    onClick={() => {
                      setCurrentBlog(blog);
                      setViewMode("article");
                      setSearch("");
                      setActiveCategory(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <BlogCard
                      thumbnail={blog.thumbnailImage}
                      category={blog.subCategory}
                      title={blog.title}
                      description={blog.description}
                      createdAt={timeAgo(blog.createdAt.toISOString())}
                      updatedAt={timeAgo(blog.updatedAt.toISOString())}
                      href="#"
                       /* Styling */
                      wrapperClassName="border border-gray-300 rounded-md overflow-hidden bg-white"
                      imageWrapperClassName="border-b border-gray-300"
                      imageClassName="w-full h-[220px] object-cover"
                      contentClassName="p-4 space-y-2"
                      categoryClassName="text-sm font-semibold text-orange-500"
                      titleClassName="text-lg font-bold text-gray-900 leading-snug"
                      metaClassName="text-xs text-gray-500"
                      descriptionClassName="text-sm text-gray-700"
                      readMoreClassName="text-sm font-semibold text-orange-500 hover:underline"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="space-y-8">
          <SearchInput
            placeholder="Search blogs..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setViewMode("results");
            }}
          />

          <div>
            <PageRouteHeader/>
            <h2 className="text-xl font-semibold mb-2">
              Category
            </h2>
            <hr className="border-gray-300 mb-4" />

            <CategoryChipGroup
              categories={categories}
              onChange={(cat) => {
                setActiveCategory(cat);
                setViewMode("results");
              }}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
