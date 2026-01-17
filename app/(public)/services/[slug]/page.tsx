import ServiceDetail from "@/components/clientPage/services/ServiceDetail";
import { notFound } from "next/navigation";
import { getServiceBySlugAction } from "../../actions/public.service.action";


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
    const service = await getServiceBySlugAction(slug);
    if (!service) return notFound();


  if (!service) return notFound();

  return (
    <div className="w-full">
      <ServiceDetail service={service} />
    </div>
  );
}
