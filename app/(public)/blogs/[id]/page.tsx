"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import blogsData from "@/lib/data/blogs/blogs.json";

import SearchInput from "@/components/common/SearchInput";
import CategoryChipGroup from "@/components/public/CategoryChipGroup";
import BlogCard from "@/components/admin/BlogCard";
import { timeAgo } from "@/lib/utils/timeAgo";

interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailImage: string;
  category: string;
  subCategory: string;
  richText: string;
  createdAt: string;
  updatedAt: string;
}

type ViewMode = "article" | "results";

export default function SingleBlogPage() {
  const { id } = useParams<{ id: string }>();
  const blogs = blogsData as Blog[];

  /* =========================
     STATES
  ========================= */
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("article");

  /* =========================
     INITIAL BLOG LOAD
  ========================= */
  useEffect(() => {
    const found = blogs.find((b) => b.id === id);
    setCurrentBlog(found || null);
    setViewMode("article");
  }, [id]);

  /* =========================
     FILTERED BLOGS (LEFT AREA)
  ========================= */
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !activeCategory || blog.subCategory === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [blogs, search, activeCategory]);

  /* =========================
     CATEGORIES
  ========================= */
  const subCategories = [
    "Living Room Design",
    "Bedroom Design",
    "Modular Kitchen Design",
    "Bathroom Design",
    "Dining Room Design",
    "Home Office Design",
    "Kids Room Design",
    "Wardrobe & Storage Design",
    "Balcony & Outdoor Design",
    "False Ceiling & Lighting Design",
  ];

  const categories = [
    "All",
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
  ];

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

          {/* 🔹 ARTICLE VIEW */}
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
                dangerouslySetInnerHTML={{ __html: currentBlog.richText }}
              />
            </article>
          )}

          {/* 🔹 SEARCH / FILTER RESULT VIEW */}
          {viewMode === "results" && (
            <>
              <h2 className="text-2xl font-bold mb-6">
                Search Results
              </h2>

              {filteredBlogs.length === 0 && (
                <p className="text-gray-500">
                  No blogs found
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    onClick={() => {
                      setCurrentBlog(blog);
                      setViewMode("article");
                      setSearch("");
                      setActiveCategory(null);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="cursor-pointer"
                  >
                    <BlogCard
                      thumbnail={blog.thumbnailImage}
                      category={blog.subCategory}
                      title={blog.title}
                      description={blog.description}
                      createdAt={timeAgo(blog.createdAt)}
                      updatedAt={timeAgo(blog.updatedAt)}
                      href="#"

                      /* Styling */
                      wrapperClassName="border border-gray-300 rounded-md overflow-hidden bg-white hover:shadow-md transition"
                      imageWrapperClassName="border-b border-gray-300"
                      imageClassName="w-full h-[180px] object-cover"
                      contentClassName="p-4 space-y-2"
                      categoryClassName="text-xs font-semibold text-orange-500"
                      titleClassName="text-base font-bold text-gray-900 leading-snug"
                      metaClassName="hidden"
                      descriptionClassName="text-sm text-gray-700 line-clamp-2"
                      readMoreClassName="hidden"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="space-y-8">

          {/* SEARCH */}
          <SearchInput
            placeholder="Search blogs..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setViewMode("results");
            }}
          />

          {/* CATEGORY CHIPS */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Sub-Category
            </h2>
            <hr className="border-gray-300 mb-4" />

            <CategoryChipGroup
              categories={subCategories}
              onChange={(cat) => {
                setActiveCategory(cat);
                setViewMode("results");
              }}
            />
          </div>

          {/* CATEGORY CHIPS */}
          <div>
            <h2 className="text-xl font-semibold mb-2">
              Top-Category
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
