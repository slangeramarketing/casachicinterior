import CategoryForm from "@/components/admin/CategoryForm";
import { getCategoryById } from "@/modules/category/category.service";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ✅ UNWRAP params
  const { id } = await params;

  // 🔒 validate id BEFORE db call
  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  // console.log("ID: ",id);
  
  const categoryDoc = await getCategoryById(id);

  if (!categoryDoc) notFound();

  // ✅ Convert Mongoose doc → plain object
  const category = {
    _id: categoryDoc._id.toString(),
    name: categoryDoc.name,
    slug: categoryDoc.slug,
    description: categoryDoc.description ?? "",
    isActive: categoryDoc.isActive,
  };


  return (
    <div className="max-w-3xl mx-auto pt-6">
      <h1 className="text-2xl font-semibold mb-4">
        Edit Category
      </h1>

      <CategoryForm
        initialData={category}
        categoryId={id}
      />
    </div>
  );
}
