import { notFound } from "next/navigation";

import BlogForm from "@/components/clientPage/BlogForm";
import { getAllCategories } from "@/modules/category/category.service";
import { getAllSubCategories } from "@/modules/subcategory/subcategory.service";
import { getBlogById } from "@/modules/blogs/blog.service";
import { mapBlogToDTO } from "@/types/blogs";

/* -------------------------------------
   Page (SERVER)
------------------------------------- */
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ unwrap params (new Next.js behavior)
  const { id } = await params;

  // 1️⃣ Fetch blog
  const blogDoc = await getBlogById(id);
  if (!blogDoc) notFound();

  const blog = mapBlogToDTO(blogDoc);

  // 2️⃣ Fetch categories
  const categoryDocs = await getAllCategories();
  const subCategories = await getAllSubCategories();

  const categories = categoryDocs.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BlogForm
        mode="view"           // 🔥 default READ MODE
        initialData={blog}
        categories={categories}
        subcategories={subCategories}
      />
    </div>
  );
}
