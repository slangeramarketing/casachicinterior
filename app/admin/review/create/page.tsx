/***************************************************
 * File: app/admin/reviews/create/page.tsx
 * Layer: Server Page
 *
 * Purpose:
 * - Prepare data for review link generation
 *
 * Responsibilities:
 * - Fetch services
 * - Adapt ServiceResponseDTO → UI-friendly options
 *
 * Restrictions:
 * - Must NOT contain client logic
 ***************************************************/

import ReviewForm from "@/components/admin/clientComponent/review/ReviewForm";
import { serviceServer } from "@/modules/services/service.server";

export default async function GenerateReviewLinkServerPage() {
  const services = await serviceServer.getAll();
  // ServiceResponseDTO[]

  // 🔹 Adapt backend DTO → UI select options
  const serviceOptions = services.map((service) => ({
    id: service.id,
    name: service.title, // FIX: title → name
  }));

  return (
    <div className="p-6">
      <ReviewForm mode="create" services={serviceOptions} />
    </div>
  );
}
