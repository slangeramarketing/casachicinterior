import { notFound } from "next/navigation";
import { serviceServer } from "@/modules/services/service.server";
import ServiceDetail from "@/components/clientPage/services/ServiceDetail";
import { getServiceByIdAction } from "@/app/admin/actions/admin.service.action";

export default async function AdminServiceViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const service = await getServiceByIdAction(id);
  if (!service) return notFound();

  return <ServiceDetail service={service} isAdmin />;
}
