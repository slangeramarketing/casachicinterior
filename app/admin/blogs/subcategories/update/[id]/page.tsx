import SubCategoryForm from "@/components/admin/SubCategoryForm";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { subCategoryServer } from "@/modules/blog-subcategory/subcategory.server";
import { categoryServer } from "@/modules/blog-category/category.server";
import { PageRouteHeader } from "@/components/common/PageHeader";

export default async function EditSubCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id) notFound();

  const subCategory = await subCategoryServer.getById(id);
  if (!subCategory) notFound();

  const categories = await categoryServer.getAll();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Create Category
        </h1>

        <SubCategoryForm
          initialData={subCategory}
          subCategoryId={id}
          categoryData={categories}
        />
      </div>
    </div>
  );
}


