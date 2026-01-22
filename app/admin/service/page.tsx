/***************************************************
 * File: app/admin/service/page.tsx
 * Type: Server Page
 *
 * Purpose:
 * - Fetch services from DB (admin)
 * - Define server actions (delete)
 * - Pass data + handlers to client page
 ***************************************************/

import { Metadata } from "next";
import ServiceList from "@/components/admin/clientComponent/service/ServiceList";
import { serviceServer } from "@/modules/services/service.server";
import { notFound } from "next/navigation";
import { PageRouteHeader} from "@/components/common/PageHeader";

/* -------------------------------------
   SEO Metadata
------------------------------------- */
export const metadata: Metadata = {
  title: "Service Management | Admin Dashboard",
  description: "Manage and curate interior design services for the platform.",
  robots: { index: false, follow: false }, // Admin pages should not be indexed
};

/* -------------------------------------
   Page Component
------------------------------------- */
export default async function AdminServiceServerPage() {
  /**
   * Data Fetching: Direct call to Server Facade.
   * No HTTP/Action overhead here.
   */
  const services = await serviceServer.getAll();


  return (
    <main>
      <div className="flex flex-col gap-2 pb-2">
        <PageRouteHeader />
      </div>
        <ServiceList 
          services={services} 
        />
    </main>
  );
}