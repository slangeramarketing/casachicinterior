import { notFound } from "next/navigation";
import ServiceForm from "@/components/admin/clientComponent/service/ServiceForm";
import { serviceServer } from "@/modules/services/service.server";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
// Direct Server Functions (Not Actions)

export default async function UpdateServiceServerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Resolve params (Next.js 15 Requirement)
  const { id } = await params;

  // 2. Fetch Data Parallelly for performance
  const [service, allCategories] = await Promise.all([
    serviceServer.getById(id),
    serviceCategoryServer.getAll() // Sabhi categories chahiye dropdown ke liye
  ]);

  // 3. 404 Check
  if (!service) return notFound();

  /* -----------------------------------------------------
     Normalizing Categories for the Dropdown
     Client component expects: { id: string; name: string }[]
  ----------------------------------------------------- */

  return (
    <div>
      <ServiceForm
        mode="update"
        categories={allCategories}
        initialData={service} // ServiceResponseDTO (id included)
      />
    </div>
  );
}