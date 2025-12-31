import SubCategoryForm from "@/components/admin/SubCategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { getAllCategories } from "@/modules/category/category.service";
import { CategoryDTO } from "@/types/category";


export default async function CreateSubCategoryPage() {
    const categoryData:CategoryDTO[] = await getAllCategories();
  return (
    <div className="w-full flex flex-col justify-items-center justify-center items-center">
      <div className="w-full px-4">
        <PageRouteHeader/>
      </div>
      <div className="pt-6 w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Create Category
        </h1>

        <SubCategoryForm categoryData={categoryData} />
      </div>
    </div>
  );
}
