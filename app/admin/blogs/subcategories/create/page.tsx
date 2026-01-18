

import { PageRouteHeader } from "@/components/common/PageHeader";
import { categoryServer } from "@/modules/blog-category/category.server";
import SubCategoryForm from "@/components/admin/SubCategoryForm";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { CreateSubCategoryDTO } from "@/modules/blog-subcategory/subcategory.dto";

export default async function CreateSubCategoryPage() {
  
  const categoryData= await categoryServer.getAll();

  async function handleCreate(data: CreateSubCategoryDTO) {
    "use server";
    await subCategoryServer.create(data);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Create Subcategory
        </h1>

        <SubCategoryForm categoryData={categoryData} onCreate={handleCreate} />
      </div>
    </div>
  );
}
