import { notFound } from "next/navigation";
import { serviceServer } from "@/modules/services/service.server";
import ServiceDetail from "@/components/clientPage/services/ServiceDetail";

export default async function AdminServiceViewPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const service = await serviceServer.getById(id);
  if (!service) return notFound();

  return <ServiceDetail service={service} isAdmin />;
}
