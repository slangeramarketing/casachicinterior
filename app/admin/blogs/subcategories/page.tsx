import CategoriesTable from "@/components/clientPage/CategoriesTable";
import SubCategoriesTable from "@/components/clientPage/SubCategoryTable";
import { getAllCategories } from "@/modules/category/category.service";
import { getAllSubCategories } from "@/modules/subcategory/subcategory.service";
import { SubCategoryDTO } from "@/types/subCategory";

export default async function SubCategoriesPage() {
  const subCategory:SubCategoryDTO[] = await getAllSubCategories();

  return (
    <div className="px-8 py-6">
      <SubCategoriesTable subCategories={subCategory} />
    </div>
  );
}
