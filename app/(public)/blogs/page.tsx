"use client";

import { useState } from "react";
import BlogCard from "@/components/admin/BlogCard";
import SearchInput from "@/components/common/SearchInput";
import CategorySlider from "@/components/public/CategorySlider";
import { timeAgo } from "@/lib/utils/timeAgo";
import blogsData from "@/lib/data/blogs/blogs.json";

type Blog = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailImage: string;
  category: string;
  subCategory: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogsPage() {
  const [search, setSearch] = useState("");

  const categories = [
    "All",
    "Living Room",
    "Bedroom",
    "Kitchen",
    "Bathroom",
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const blogs = blogsData as Blog[];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesCategory =
      activeCategory === "All" ||
      blog.subCategory === activeCategory;

    const matchesSearch =
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });


  return (
    <div className="py-32 px-6 lg:px-38 flex flex-col gap-8">
      {/* Search */}
      <SearchInput 
          value={search}
          placeholder="Search blogs..."
          onChange={(value) => setSearch(value)} />

      {/* Category Slider */}
      <div>
        <h1 className="text-2xl font-bold pb-4">Top-Category</h1>

        <CategorySlider
          categories={categories}
          onChange={(cat) => setActiveCategory(cat)}
        />
      </div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            thumbnail={blog.thumbnailImage}
            category={blog.subCategory}
            title={blog.title}
            description={blog.description}
            createdAt={timeAgo(blog.createdAt)}
            updatedAt={timeAgo(blog.updatedAt)}
            href={`/blogs/${blog.id}`}

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
        ))}
      </div>
    </div>
  );
}
