import { notFound } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";
import { UpdateBlogDTO } from "@/modules/blogs/blog.dto";
import BlogForm from "@/components/admin/clientComponent/blogs/BlogForm";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { requireAuth } from "@/lib/auth";

export default async function BlogUpdateServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await requireAuth(); // 👈 Auth check
  

  // 1. Parallel Fetching for better performance 🚀
  const [blogRes, categoryRes] = await Promise.all([
    blogServer.getById(id),
    blogCategoryServer.getList(),
  ]);

  // 2. Success checks aur Error Handling
  if (!blogRes.success || !blogRes.data) {
    notFound();
  }

  const blogData = blogRes.data;
// Is tareeke se 'any' error khatam ho jayegi
const categories: BlogCategoryResponseDTO[] = categoryRes.success && categoryRes.data 
  ? categoryRes.data 
  : [];

  return (
    <div className="max-w-7xl mx-auto py-6 lg:px-4">
      {/* Page Header ya Breadcrumbs yahan add kar sakte hain */}
      <PageRouteHeader/>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Blog Post</h1>
        <p className="text-sm text-gray-500">Update your content, SEO settings, and featured status.</p>
      </div>

      <BlogForm
        mode="edit" // Ab sirf 'edit' aur 'create' mode hain 📝
        initialData={blogData}
        categories={categories}
        currentUserId={user.userId} // 👈 User ID pass karo
      />
    </div>
  );
}