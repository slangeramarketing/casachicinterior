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
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { serviceServer } from "@/modules/services/service.server";

/* =====================================================
   Page
===================================================== */
export default async function UpdateServiceServerPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  console.log("ID: ", id);

  /* ---------------------------------
     Fetch service (ADMIN)
  --------------------------------- */
  const service = await serviceServer.getById(id);
  if (!service) return notFound();

  /* ---------------------------------
     Fetch categories (ADMIN)
  --------------------------------- */
  const categories = await serviceCategoryServer.getActive();

  /* =====================================================
     Server Action: Update Service
  ===================================================== */
  async function updateServiceAction(data: any) {
    "use server";

    await serviceServer.update(id, data);
  }

  return (
    <ServiceForm
      mode="update"
      categories={categories}
      initialData={service}
      onSubmit={updateServiceAction}
    />
  );
}
