"use client";

import { useState, useMemo } from "react";
import PublicBlogCard from "./PublicBlogCard";
import SearchInput from "@/components/common/SearchInput";
import CategorySlider from "@/components/public/CategorySlider";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import Image from "next/image";

interface Props {
  blogs: BlogResponseDTO[];
  categories: BlogCategoryResponseDTO[];
}

export default function PublicBlogListPage({ blogs, categories }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // --- Filtering Logic ---
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Search logic (Title aur Summary dono par)
      const matchesSearch = 
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        (blog.summary?.toLowerCase().includes(search.toLowerCase()) ?? false);
      
      // Category logic (Slug based)
      // Note: Hum 'activeCategory' mein category ka 'slug' store kar rahe hain
      const matchesCategory = 
        activeCategory === "All" || 
        (blog.category as any)?.slug === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, blogs]);

  return (
    <div className="min-h-screen bg-white">
      {/* --- Modern Hero Section --- */}
    <section className="relative h-[60vh] min-h-[400px] flex items-center px-6 lg:px-32 overflow-hidden">
    
    {/* Background Image */}
    <Image
        src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1920&auto=format&fit=crop
    "
        alt="Interior Design Blog Background"
        fill
        priority
        className="object-cover"
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-0" />

    {/* Orange Glow */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/30 blur-[100px] rounded-full z-0" />



    {/* Content */}
    <div className="relative z-10 w-full">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight">
        THE <span className="text-orange-500">INTERIOR</span> BLOG
        </h1>

        <p className="text-neutral-200 mt-6 max-w-lg text-lg md:text-xl font-medium leading-relaxed">
        Design tips, trends, and stories to help you build your dream space.
        </p>

        <div className="mt-8 flex items-center gap-4">
        <div className="h-[2px] w-12 bg-orange-500"></div>
        <span className="text-orange-500 font-bold uppercase tracking-widest text-xs">
            Explore Trends
        </span>
        </div>
    </div>

    </section>


      {/* --- Filters & Search Bar --- */}
      <div className="px-6 lg:px-32 -mt-8 relative z-20">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-neutral-100 flex flex-col gap-8">
          
          {/* Slider Row */}
          <CategorySlider 
            categories={categories} 
            activeCategory={activeCategory} 
            onCategoryChange={setActiveCategory} 
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-50">
            <p className="text-sm font-medium text-neutral-500 italic">
              Showing {filteredBlogs.length} results
            </p>
            <div className="w-full md:w-80">
              <SearchInput 
                value={search} 
                onChange={setSearch} 
                placeholder="Search articles..." 
              />
            </div>
          </div>
        </div>
      </div>

      {/* --- Blog Grid --- */}
      <main className="px-6 lg:px-32 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredBlogs.map((blog) => (
          <PublicBlogCard 
            key={blog.id}
            title={blog.title}
            summary={blog.summary}
            thumbnail={blog.thumbnail || ""}
            updatedAt={blog.updatedAt}
            slug={blog.slug}
          />
        ))}
      </main>
    </div>
  );
}