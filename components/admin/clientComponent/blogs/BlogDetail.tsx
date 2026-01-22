"use client";
import Link from "next/link";
import { BsArrowLeft, BsEye } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { BiCalendar, BiGlobe, BiTag } from "react-icons/bi";
import { CgLock } from "react-icons/cg";

// Types based on your model
interface BlogDetailProps {
  blog: any; // Replace with your BlogResponseDTO
}

export default function BlogDetail({ blog }: BlogDetailProps) {
  return (
    <div className="lg:max-w-7xl mx-auto p-2 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/admin/blogs" className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-2 transition-colors">
            <BsArrowLeft size={16} /> Back to Blogs
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{blog.title}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            blog.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {blog.status}
          </div>
          <Link 
            href={`/admin/blogs/${blog.id}`} 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <FiEdit3 size={18} /> Edit Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN CONTENT AREA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Banner Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <img 
              src={blog.bannerImage || "/placeholder-banner.jpg"} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thumnail Image */}
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <img 
              src={blog.thumbnail || "/placeholder-thumbnail.jpg"} 
              alt="Banner" 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Short Summary</h3>
            <p className="text-gray-700 leading-relaxed italic border-l-4 border-blue-100 pl-4">
              {blog.summary || "No summary provided."}
            </p>
          </div>

          {/* Content Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50">Post Content</h3>
            <div 
              className="prose prose-blue max-w-none prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: blog.content }} 
            />
          </div>

          {/* SEO Details Card */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">SEO & Social Preview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Meta Title</label>
                  <p className="text-sm font-medium text-gray-800">{blog.seo?.metaTitle || blog.title}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Meta Robots</label>
                  <p className="text-sm text-gray-800 flex items-center gap-2"><BiGlobe size={14}/> {blog.seo?.metaRobots}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Canonical URL</label>
                  <p className="text-sm text-blue-500 break-all">{blog.seo?.canonicalUrl || "Default"}</p>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500">OG Image Preview</label>
                <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-gray-50 border border-dashed border-gray-200">
                  <img src={blog.seo?.ogImage || blog.thumbnail} className="w-full h-full object-cover opacity-80" alt="OG Preview" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-6">
          
          {/* Stats Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Post Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500"><BsEye size={16} /> Views</span>
                <span className="font-bold text-gray-800">{blog.viewCount || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500"><CgLock size={16} /> Reading Time</span>
                <span className="font-bold text-gray-800">{blog.readingTime || 0} min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500"><BiCalendar size={16} /> Published</span>
                <span className="font-bold text-gray-800">
                  {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Taxonomy Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Categorization</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Category</label>
                <div className="bg-blue-50 text-blue-700 px-3 py-2 rounded-xl text-sm font-semibold">
                  {blog.categoryId?.name || "Uncategorized"}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {blog.tags?.map((tag: string) => (
                    <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-lg text-xs font-medium border border-gray-200">
                      <BiTag size={10} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Featured Toggle Info */}
          {blog.featured && (
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3">
              <div className="bg-orange-500 p-2 rounded-lg text-white">★</div>
              <div>
                <p className="text-sm font-bold text-orange-800">Featured Post</p>
                <p className="text-[10px] text-orange-600 uppercase font-bold">Visible on Home Section</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}