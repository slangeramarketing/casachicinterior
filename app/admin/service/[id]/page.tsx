/***************************************************
 * File: app/admin/service/[id]/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Update existing Service
 *
 * Responsibilities:
 * - Fetch service by id (admin)
 * - Fetch service categories (admin)
 * - Define server action for update
 * - Pass data + handler to client ServiceForm
 *
 * Restrictions:
 * - Must NOT contain UI logic
 * - Must NOT contain business logic
 ***************************************************/

import { notFound } from "next/navigation";
import ServiceForm from "@/components/clientPage/services/ServiceForm";
import { getServiceByIdAction } from "../../actions/admin.service.action";
import { getServiceCategoryByIdAction } from "../../actions/admin.service-categories.actions";

interface CategoryOption {
  id: string;
  name: string;
}

/* =====================================================
   Page
===================================================== */
export default async function UpdateServiceServerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  /* ---------------------------------
     Fetch service (ADMIN)
  --------------------------------- */
  const service = await getServiceByIdAction(id);
  if (!service) return notFound();


/* Fetch category (ADMIN) Normalize to array --------------------------------- */ 
const categoryRecord = await getServiceCategoryByIdAction(service.categoryId); 
const categories: CategoryOption[] = categoryRecord ? [{ id: categoryRecord.id, name: categoryRecord.name }] : [];


  return (
    <ServiceForm
      mode="update"
      categories={categories}
      initialData={service}
    />
  );
}
