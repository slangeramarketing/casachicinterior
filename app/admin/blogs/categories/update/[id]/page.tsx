import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";
import { categoryServer } from "@/modules/blog-category/category.server";
import { CreateCategoryDTO } from "@/modules/blog-category/category.dto";

export default async function UpdateCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await categoryServer.getById(id);
  if (!category) notFound();

  async function handleUpdate(
    categoryId: string,
    data: CreateCategoryDTO
  ) {
    "use server";
    await categoryServer.update(categoryId, data);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full px-4">
        <PageRouteHeader />
      </div>

      <div className="pt-6 w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Update Category
        </h1>

        <CategoryForm
          initialData={category}
          categoryId={id}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  );
}
