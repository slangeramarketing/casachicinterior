import BlogForm from "@/components/clientPage/blogs/BlogForm";
import { blogServer } from "@/modules/blogs/blog.server";
import { categoryServer } from "@/modules/blog-category/category.server";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { UpdateBlogDTO } from "@/modules/blogs/blog.dto";
import { notFound } from "next/navigation";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await blogServer.getById(id);
  if (!blog) notFound();

  const categories = await categoryServer.getAll();
  const subCategories = await subCategoryServer.getAll();

  async function handleUpdate(
    blogId: string,
    data: UpdateBlogDTO
  ) {
    "use server";
    await blogServer.update(blogId, data);
  }

  return (
    <BlogForm
      mode="view"
      initialData={blog}
      categories={categories}
      subcategories={subCategories}
      onUpdate={handleUpdate}
    />
  );
}
