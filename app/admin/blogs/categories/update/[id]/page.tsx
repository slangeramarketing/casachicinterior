import { notFound } from "next/navigation";
import BlogCategoryForm from "@/components/admin/clientComponent/blogs/BlogCategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";

export default async function UpdateBlogCategoryServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Data Fetching
  const [categoryRes, allCategoriesRes] = await Promise.all([
    blogCategoryServer.getById(id),
    blogCategoryServer.getList() // Parent selection ke liye flat list
  ]);

  if (!categoryRes.success || !categoryRes.data) notFound();

  const category = categoryRes.data;
  const allCategories = allCategoriesRes.success ? allCategoriesRes.data : [];


  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-full max-w-5xl"> 
        <BlogCategoryForm
          mode="update"
          initialData={category}
          allCategories={allCategories}
        />
      </div>
    </div>
  );
}