
import PublicBlogListPage from "@/components/public/blogs-page/PublicBlogListPage";
import { BlogCategoryResponseDTO } from "@/modules/blog-category/blog-category.dto";
import { blogCategoryServer } from "@/modules/blog-category/blog-category.server";
import { blogServer } from "@/modules/blogs/blog.server";


export default async function BlogsServerPage() {
  const result = await blogServer.getAll();
  console.log("blogs Data: ",result.data);

  const blogCategoryList=await blogCategoryServer.getList();

  // Is tareeke se 'any' error khatam ho jayegi
  const categories: BlogCategoryResponseDTO[] = blogCategoryList.success && blogCategoryList.data 
    ? blogCategoryList.data 
    : [];

  // Error handling
  if (!result.success) {
    return (
      <div className="p-10 text-center text-red-500">
        Error loading blogs: {result.error}
      </div>
    );
  }
  return (
    <PublicBlogListPage blogs={result.data || []} categories={categories} />
  );
}
