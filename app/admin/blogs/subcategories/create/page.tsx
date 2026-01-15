

import CategoryForm from "@/components/admin/CategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { categoryServer } from "@/modules/blog-category/category.server";
import { CreateCategoryDTO } from "@/modules/blog-category/category.dto";
import SubCategoryForm from "@/components/admin/SubCategoryForm";

export default async function CreateSubCategoryPage() {
  
  const categoryData= await categoryServer.getAll();

  async function handleCreate(data: CreateCategoryDTO) {
    "use server";
    await categoryServer.create(data);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Create Category
        </h1>

        <SubCategoryForm categoryData={categoryData} onCreate={handleCreate} />
      </div>
    </div>
  );
}
