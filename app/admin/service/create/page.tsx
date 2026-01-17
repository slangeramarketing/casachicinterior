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

import ServiceForm from "@/components/clientPage/services/ServiceForm";
import { getAllServiceCategoriesAction} from "../../actions/admin.service-categories.actions";


/* =====================================================
   Page
===================================================== */
export default async function CreateServiceServerPage() {
  /* ---------------------------------
     Fetch categories (ADMIN)
  --------------------------------- */
  const categories = await getAllServiceCategoriesAction();

  return (
    <div className="pb-24">
        <ServiceForm
        mode="create"
        categories={categories}
      />
    </div>
  );
}



