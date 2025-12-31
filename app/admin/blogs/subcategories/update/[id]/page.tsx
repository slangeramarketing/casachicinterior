import SubCategoryForm from "@/components/admin/SubCategoryForm";
import { getSubCategoryByIdRaw } from "@/modules/subcategory/subcategory.service";
import { getAllCategories } from "@/modules/category/category.service";
import mongoose from "mongoose";
import { notFound } from "next/navigation";
import { CreateSubCategoryInputDTO } from "@/types/subCategory";

export default async function EditSubCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) notFound();

  const subCategory = await getSubCategoryByIdRaw(id);
  if (!subCategory) notFound();

  const categories = await getAllCategories();

  // 🔑 DTO → Form DTO mapping (IMPORTANT)
  const initialData: CreateSubCategoryInputDTO = {
    name: subCategory.name,
    slug: subCategory.slug,
    description: subCategory.description,
    categoryId:
      typeof subCategory.category === "string"
        ? subCategory.category
        : subCategory.category._id,
    isActive: subCategory.isActive,
  };

  return (
    <div className="max-w-3xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Sub-Category
      </h1>

      <SubCategoryForm
        initialData={initialData}
        subCategoryId={id}
        categoryData={categories}
      />
    </div>
  );
}
