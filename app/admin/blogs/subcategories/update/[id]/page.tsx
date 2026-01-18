import SubCategoryForm from "@/components/admin/SubCategoryForm";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { categoryServer } from "@/modules/blog-category/category.server";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { UpdateSubCategoryDTO } from "@/modules/blog-subcategory/subcategory.dto";

export default async function EditSubCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("Editing SubCategory ID:", id);

  if (!id) notFound();

  const subCategory = await subCategoryServer.getById(id);
  if (!subCategory) notFound();

  const categories = await categoryServer.getAll();

    async function handleUpdate(id:string ,data: UpdateSubCategoryDTO) {
      "use server";
      await subCategoryServer.update(id, data);
    }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Update SubCategory
        </h1>

        <SubCategoryForm
          initialData={subCategory}
          subCategoryId={id}
          categoryData={categories}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}


