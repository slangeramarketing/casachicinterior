import PublicBlogListPage from "@/components/public/blogs-page/PublicBlogListPage";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";
import { BlogResponseDTO } from "@/modules/blogs/blog.dto";
import { blogServer } from "@/modules/blogs/blog.server";

export default async function BlogsServerPage() {
  const result = await blogServer.getAll();
  const blogCategoryList = await blogCategoryServer.getList();

  // ✅ blogs ALWAYS array
  const blogs: BlogResponseDTO[] =
    result.success ? result.data : [];

  // ✅ categories ALWAYS array
  const categories: BlogCategoryResponseDTO[] =
    blogCategoryList.success ? blogCategoryList.data : [];

  if (!result.success) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading blogs: {result.error}
      </div>
    );
  }

  return (
    <PublicBlogListPage
      blogs={blogs}
      categories={categories}
    />
  );
}
