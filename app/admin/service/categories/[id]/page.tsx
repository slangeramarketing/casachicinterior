/***************************************************
 * File: app/admin/service/categories/[id]/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Update existing service category
 *
 * Responsibilities:
 * - Fetch category to edit from DB
 * - Fetch all categories for parent dropdown
 * - Define server action for update
 * - Pass data + action to client form
 *
 * Restrictions:
 * - Must NOT contain UI logic
 * - Must NOT contain business logic
 ***************************************************/

import ServiceCategoryForm from "@/components/clientPage/services/ServiceCategoryForm";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { notFound } from "next/navigation";

/* =====================================================
   Page
===================================================== */
export default async function UpdateServiceCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } =await params;

  console.log("ID: ",id);
  /* ---------------------------------
     Fetch category being edited
  --------------------------------- */
  const category = await serviceCategoryServer.getById(id);

    if (!category) {
        notFound();
    }

  /* ---------------------------------
     Fetch all categories (for dropdown)
  --------------------------------- */
  const categories = await serviceCategoryServer.getAll();

  /* =====================================================
     Server Action: Update Category
  ===================================================== */
  async function updateCategoryAction(data: {
    name: string;
    slug: string;
    parentId: string | null;
    displayOrder: number;
    status: "active" | "inactive";
  }) {
    "use server";

    await serviceCategoryServer.update(id, data);
  }

  /* ---------------------------------
     Render
  --------------------------------- */
  return (
    <ServiceCategoryForm
      mode="update"
      categories={categories}
      initialData={{
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        displayOrder: category.displayOrder,
        status: category.status,
      }}
      onSubmit={updateCategoryAction}
    />
  );
}
