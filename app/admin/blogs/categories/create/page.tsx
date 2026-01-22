import BlogCategoryForm from "@/components/admin/clientComponent/blogs/BlogCategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";

export default async function CreateBlogCategoryServerPage() {
  // 1. Parent category select karne ke liye list fetch karo
  const categoriesRes = await blogCategoryServer.getList();
  const allCategories = categoriesRes.success ? categoriesRes.data : [];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Breadcrumbs aur Header */}
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-full max-w-5xl">
        <BlogCategoryForm 
          mode="create" 
          allCategories={allCategories} 
        />
      </div>
    </div>
  );
}