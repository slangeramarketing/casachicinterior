import ServiceDetail from "@/components/clientPage/services/ServiceDetail";
import { serviceServer } from "@/modules/services/service.server";
import Link from "next/link";
import { notFound } from "next/navigation";


/* -------------------------------------
   PAGE
------------------------------------- */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  const {slug}=await params;
  /* ---------------------------------
       Fetch service (ADMIN)
    --------------------------------- */
    const service = await serviceServer.getBySlug(slug);
    if (!service) return notFound();


  if (!service) return notFound();

  return (
    <div className="w-full">
      <ServiceDetail service={service} />
    </div>
  );
}
