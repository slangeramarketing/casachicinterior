
import BlogCategoryList from "@/components/admin/clientComponent/blogs/BlogCategoryList";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";

export default async function ListBlogCategoriesServerPage() {
  // Sirf data fetch ho raha hai
  const categoriesRes = await blogCategoryServer.getTree();

  // Is tareeke se 'any' error khatam ho jayegi
  const categories: BlogCategoryResponseDTO[] = categoriesRes.success && categoriesRes.data 
    ? categoriesRes.data 
    : [];

  return (
    <div className="lg:px-8 py-6">
      {/* Ab humein onDelete prop pass karne ki zaroorat nahi kyunki client khud handle karega */}
      <BlogCategoryList categories={categories} />
    </div>
  );
}