import { getAllCategories } from "@/modules/category/category.service";
import BlogForm from "@/components/clientPage/BlogForm";
import { getAllSubCategories } from "@/modules/subcategory/subcategory.service";

/* -------------------------------------
   Page (SERVER)
------------------------------------- */
export default async function CreateBlogPage() {
   const categoryDocs = await getAllCategories();
   const subCategories = await getAllSubCategories();

  // ✅ Convert Mongoose docs → plain objects
  const categories = categoryDocs.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <BlogForm
        mode="create"
        categories={categories}
        subcategories={subCategories}
      />

    </div>
  );
}
