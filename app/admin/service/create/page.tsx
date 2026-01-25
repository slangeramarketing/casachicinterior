/***************************************************
 * File: app/admin/service/create/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Create new Service
 *
 * Responsibilities:
 * - Fetch service categories (admin)
 * - Define server action for create
 * - Pass data + handler to client ServiceForm
 *
 * Restrictions:
 * - Must NOT contain UI logic
 * - Must NOT contain business logic
 ***************************************************/

import ServiceForm from "@/components/admin/clientComponent/service/ServiceForm";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { userServer } from "@/modules/users/user.server";


/* =====================================================
   Page
===================================================== */
export default async function CreateServiceServerPage() {
  /* ---------------------------------
     Fetch categories (ADMIN)
  --------------------------------- */
  const categories = await serviceCategoryServer.getAll();

  return (
    <div className="pb-24 p-4">
      <ServiceForm
        mode="create"
        categories={categories}
      />
    </div>
  );
}



