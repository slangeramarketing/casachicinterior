"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import {
  FiCalendar, FiUser, FiTag, FiSearch,
  FiFacebook, FiTwitter, FiLinkedin
} from "react-icons/fi";
import defaultImg from "@/public/assets/default.jpg";
import { useRouter } from "next/navigation";
import { ShareButton } from "@/components/common/ShareButton";
import { OptimizedImage } from "@/components/common/OptimizedImage";

interface Props {
  blog: BlogResponseDTO;
  relatedBlogs?: BlogResponseDTO[];
}

export default function PublicBlogDetail({ blog, relatedBlogs = [] }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter()

  // Date formatting
  const formattedDate = new Date(blog.createdAt || "").toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // PublicBlogDetail.tsx ke andar handleSearch function
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Ye user ko blogs list page par le jayega query ke saath
      router.push(`/blogs?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 1. Hero Banner Section */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <OptimizedImage
          src={blog.bannerImage || blog.thumbnail || defaultImg}
          alt={blog.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div className="max-w-4xl text-center text-white space-y-4">
            <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {blog.category?.name || "General"}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
              {blog.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm font-medium opacity-90">
              <span className="flex items-center gap-2">
                <FiUser className="text-orange-400" /> {blog.author?.name || "Admin"}
              </span>
              <span className="flex items-center gap-2">
                <FiCalendar className="text-orange-400" /> {formattedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-12">
        {/* 2. MAIN CONTENT AREA (Left) */}
        <main className="flex-1">
          {/* Summary / Introduction */}
          <div className="mb-8 p-6 bg-orange-50 rounded-2xl border-l-4 border-orange-500">
            <p className="text-lg text-gray-700 italic leading-relaxed">
              {blog.summary}
            </p>
          </div>

          {/* Post Content (Rich Text) */}
          <article
            className="prose prose-lg max-w-none prose-orange 
              whitespace-pre-wrap prose-img:my-10 prose-p:my-4
              prose-headings:font-black prose-headings:text-gray-900 
              prose-p:text-gray-700 prose-p:leading-loose 
              prose-img:rounded-2xl prose-blockquote:border-orange-500"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags Section */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex flex-wrap gap-2">
            {blog.tags?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition-colors cursor-pointer">
                <FiTag size={12} /> {tag}
              </span>
            ))}
          </div>

          {/* Social Share */}
          <div className="mt-8 p-6 bg-gray-50 rounded-2xl flex items-center justify-between">
            <span className="font-bold text-gray-800 flex items-center gap-2">
              <ShareButton
                title={blog.title}
                text={blog.summary}
              /><p className="text-sm font-bold">this article</p>:
            </span>
            <div className="flex gap-4">
              <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-600 hover:scale-110 transition-transform">
                <FiFacebook size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-sky-400 hover:scale-110 transition-transform">
                <FiTwitter size={20} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm text-blue-700 hover:scale-110 transition-transform">
                <FiLinkedin size={20} />
              </button>
            </div>
          </div>
        </main>

        {/* 3. SIDEBAR (Right) */}
        <aside className="w-full lg:w-96 space-y-8">
          {/* Search Box */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Search Article</h3>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Find design tips..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <button type="submit" className="hidden" />
            </form>
          </div>

          {/* Related Posts */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-gray-800 border-b pb-3 border-orange-100">
              Related Articles
            </h3>
            <div className="space-y-6">
              {relatedBlogs.length > 0 ? (
                relatedBlogs.map((item) => (
                  <Link href={`/blog/${item.slug}`} key={item.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <OptimizedImage
                        src={item.thumbnail || defaultImg}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-gray-800 group-hover:text-orange-500 line-clamp-2 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                        {item.category?.name}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No related posts found.</p>
              )}
            </div>
          </div>

          {/* Newsletter / CTA */}
          <div className="bg-orange-500 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-2">Upgrade Your Kitchen?</h3>
              <p className="text-orange-100 text-sm mb-6">Get expert modular kitchen tips delivered to your inbox.</p>
              <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-xl hover:bg-orange-50 transition-colors">
                Subscribe Now
              </button>
            </div>
            {/* Background design circle */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-500 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />
          </div>
        </aside>
      </div>
    </div>
  );
}