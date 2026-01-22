import AdminServiceDetail from "@/components/admin/clientComponent/service/ServiceDetail";
import { serviceServer } from "@/modules/services/service.server";
import { getServiceById } from "@/modules/services/service.service";
import { notFound } from "next/navigation";

// Page ko dynamic force karein agar metadata real-time chahiye
export const revalidate = 0; 

export default async function AdminServiceViewPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15 update: params is now a Promise
}) {
  // 1. Resolve params
  const { id } = await params;

  // 2. Fetch data directly from Server Layer (not Action)
  // getServiceById direct Mongoose query karega aur plain object return karega
  const service = await serviceServer.getById(id);

  // 3. Handle 404
  if (!service) {
    return notFound();
  }

  // 4. Return Updated Admin UI
  // Note: isAdmin prop ki ab zaroorat nahi hai kyunki humne Admin UI ko alag hi kar diya hai
  return (
    <main className="bg-slate-50 min-h-screen">
      <AdminServiceDetail service={service} />
    </main>
  );
}