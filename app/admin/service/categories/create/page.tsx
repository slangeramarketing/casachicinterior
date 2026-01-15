/***************************************************
 * File: app/admin/service/categories/create/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Server boundary for creating service categories
 *
 * Responsibilities:
 * - Fetch categories from DB (server side)
 * - Define server action
 * - Pass data + handler to client form
 *
 * Restrictions:
 * - Must NOT contain UI logic
 * - Must NOT contain business logic
 ***************************************************/

import ServiceCategoryForm from "@/components/clientPage/services/ServiceCategoryForm";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";

/* =====================================================
   Server Action
===================================================== */
async function createServiceCategory(data: {
  name: string;
  slug: string;
  parentId: string | null;
  displayOrder: number;
  status: "active" | "inactive";
}) {
  "use server";

  await serviceCategoryServer.create(data);
}

/* =====================================================
   Page
===================================================== */
export default async function CreateServiceCategoryPage() {
  /* ---------------------------------
     Fetch categories from DB (ADMIN)
  --------------------------------- */
  const categories = await serviceCategoryServer.getAll();

  return (
    <ServiceCategoryForm
      mode="create"
      categories={categories}
      onSubmit={createServiceCategory}
    />
  );
}
