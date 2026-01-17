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
import { getAllServicesAction } from "../actions/admin.service.action";

/* =====================================================
   Page
===================================================== */
export default async function AdminServiceServerPage() {
  /* -----------------------------
     Fetch services (DB)
  ----------------------------- */
  const services = await getAllServicesAction();

  if(!services){
    return <div>No services found.</div>
  }


  return (
    <ServiceList
      services={services}
      isAdmin
    />
  );
}
