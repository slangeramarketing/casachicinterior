import { redirect } from "next/navigation";
import { blogServer } from "@/modules/blogs/blog.server";
import { CreateBlogDTO } from "@/modules/blogs/blog.dto";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import BlogForm from "@/components/admin/clientComponent/blogs/BlogForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { requireAuth } from "@/lib/auth";

export default async function CreateBlogServerPage() {

  const user = await requireAuth(); // Logged in user ki details lo

 console.log("currect user: ",user);
  // 1. Categories fetch karein
  const categoryRes = await blogCategoryServer.getList();

  // 2. Type error fix: success check ke saath data extract karein 🛡️
  const categories = (categoryRes.success ? categoryRes.data : []) as BlogCategoryResponseDTO[];



  return (
    <div className="lg:max-w-7xl mx-auto py-6 md:px-4">
      {/* Page Header */}
      <div className="mb-6 p-4">
        <PageRouteHeader/>
        <h1 className="text-2xl font-bold text-gray-800">Create New Post</h1>
        <p className="text-sm text-gray-500">Share your thoughts with the world. Draft or publish immediately.</p>
      </div>

      <BlogForm
        mode="create"
        categories={categories}
        currentUserId={user.userId}
      />
    </div>
  );
}