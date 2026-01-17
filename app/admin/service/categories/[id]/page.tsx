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

import { getAllServiceCategoriesAction, getServiceCategoryByIdAction } from "@/app/admin/actions/admin.service-categories.actions";
import ServiceCategoryForm from "@/components/clientPage/services/ServiceCategoryForm";
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

  /* ---------------------------------
     Fetch category being edited
  --------------------------------- */
  const category = await getServiceCategoryByIdAction(id);

    if (!category) {
        notFound();
    }

  /* ---------------------------------
     Fetch all categories (for dropdown)
  --------------------------------- */
  const categories = await getAllServiceCategoriesAction();


  /* ---------------------------------
     Render
  --------------------------------- */
  return (
    <ServiceCategoryForm
      mode="update"
      categories={categories}
      initialData={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        displayOrder: category.displayOrder,
        status: category.status,
      }}
    />
  );
}
