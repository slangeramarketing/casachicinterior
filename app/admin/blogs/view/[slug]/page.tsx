import { notFound } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import { PageRouteHeader } from "@/components/common/PageHeader";
import BlogDetail from "@/components/admin/clientComponent/blogs/BlogDetail";

export default async function BlogDetailServerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("SLUG: ",slug)

  // 1. Parallel Fetching for better performance 🚀
  const blogRes= await blogServer.getBySlug(slug);

  // 2. Success checks aur Error Handling
  if (!blogRes.success || !blogRes.data) {
    notFound();
  }

  const blogData = blogRes.data;

  return (
    <div className="lg:max-w-7xl mx-auto py-6 lg:px-4">
      {/* Page Header ya Breadcrumbs yahan add kar sakte hain */}
      <PageRouteHeader/>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Blog Post</h1>
        <p className="text-sm text-gray-500">Update your content, SEO settings, and featured status.</p>
      </div>
      <BlogDetail blog={blogData}/>
    </div>
  );
}