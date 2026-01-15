import BlogCategoryList from "@/components/clientPage/blogs/BlogCategoryList";
import { categoryServer } from "@/modules/blog-category/category.server";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";

/* -------------------------------------
   Page (SERVER)
------------------------------------- */
export default async function CategoriesPage() {
  const categories = await categoryServer.getAll();
  const subCategories = await subCategoryServer.getAll();

  /* -------------------------------
     Server Actions
  ------------------------------- */
  async function handleDeleteCategory(id: string) {
    "use server";
    await categoryServer.delete(id);
  }

  async function handleDeleteSubCategory(id: string) {
    "use server";
    await subCategoryServer.delete(id);
  }

  return (
    <div className="px-8 py-6">
      <BlogCategoryList
        categories={categories}
        subCategories={subCategories}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubCategory={handleDeleteSubCategory}
      />
    </div>
  );
}
