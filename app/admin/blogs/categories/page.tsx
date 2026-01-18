import BlogCategoryList from "@/components/clientPage/blogs/BlogCategoryList";
import { categoryServer } from "@/modules/blog-category/category.server";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { revalidatePath } from "next/cache";

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
    // 2. Batayein ki kis path ka data refresh karna hai
    revalidatePath("/admin/blogs/categories");
  }

  async function handleDeleteSubCategory(id: string) {
    "use server";
    await subCategoryServer.delete(id);

    // Sub-category delete hone par bhi list refresh honi chahiye
    revalidatePath("/admin/blogs/categories");
  }

  return (
    <div className="lg:px-8 py-6">
      <BlogCategoryList
        categories={categories}
        subCategories={subCategories}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubCategory={handleDeleteSubCategory}
      />
    </div>
  );
}
