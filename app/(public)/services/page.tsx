import { Metadata } from "next";
import { serviceServer } from "@/modules/services/service.server";
import PublicServicesList from "@/components/public/service-page/PublicServiceList";

export const metadata: Metadata = {
  title: "Interior Design Services | Casachic Interior",
  description: "Luxury interior design services in Patna. From 3D planning to complete home renovation.",
  // ... rest of metadata
};

// Force dynamic agar aap chahte ho status change turant dikhe
export const revalidate = 3600; // 1 ghante mein cache refresh

export default async function ServicesPage() {
  // Direct Server Call (Populated categories ke saath aayega)
  const services = await serviceServer.getPublic();

  return (
    <main className="w-full">
      <PublicServicesList services={services} />
    </main>
  );
}