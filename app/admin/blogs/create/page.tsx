import BlogForm from "@/components/clientPage/blogs/BlogForm";
import { categoryServer } from "@/modules/blog-category/category.server";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { CreateBlogDTO } from "@/modules/blogs/blog.dto";
import { blogServer } from "@/modules/blogs/blog.server";

export default async function CreateBlogPage() {
  const categories = await categoryServer.getAll();
  const subCategories = await subCategoryServer.getAll();

  async function handleCreate(data: CreateBlogDTO) {
    "use server";
    await blogServer.create(data);
  }

  return (
    <BlogForm
      mode="create"
      categories={categories}
      subcategories={subCategories}
      onCreate={handleCreate}
    />
  );
}
