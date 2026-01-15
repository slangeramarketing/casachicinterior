/***************************************************
 * File: app/admin/service/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Fetch services from DB (admin)
 * - Define server actions (delete)
 * - Pass data + handlers to client page
 ***************************************************/

import ServiceList from "@/components/clientPage/services/ServiceList";
import { serviceServer } from "@/modules/services/service.server";
import { revalidatePath } from "next/cache";

/* =====================================================
   Page
===================================================== */
export default async function AdminServiceServerPage() {
  /* -----------------------------
     Fetch services (DB)
  ----------------------------- */
  const services = await serviceServer.getAll();

  /* -----------------------------
     Server Action: Delete
  ----------------------------- */
  async function handleDelete(serviceId: string) {
    "use server";

    await serviceServer.remove(serviceId);

    // refresh list after delete
    revalidatePath("/admin/service");
  }

  return (
    <ServiceList
      services={services}
      isAdmin
      onDelete={handleDelete}
    />
  );
}
