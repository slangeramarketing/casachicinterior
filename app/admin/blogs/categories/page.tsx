import CategoriesTable from "@/components/clientPage/CategoriesTable";
import { getAllCategories } from "@/modules/category/category.service";
import { CategoryDTO } from "@/types/category";

export default async function CategoriesPage() {
  const categoriesDoc = await getAllCategories();

  // converting mongoos object into plain js
  const categories: CategoryDTO[] = categoriesDoc.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    isActive: cat.isActive,
    createdAt: cat.createdAt.toISOString(),
    updatedAt: cat.updatedAt.toISOString(),
  }));

  return (
    <div className="px-8 py-6">
      <CategoriesTable categories={categories} />
    </div>
  );
}
