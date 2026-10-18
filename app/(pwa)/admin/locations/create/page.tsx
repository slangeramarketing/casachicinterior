import { Metadata } from "next";
import LocationForm from "@/components/admin/clientComponent/locations/LocationForm";
import { serviceServer } from "@/modules/services/service.server";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = {
  title: "Add Location Page | Admin",
  robots: { index: false, follow: false },
};

export default async function CreateLocationPage() {
  const [services, siteUrl] = await Promise.all([
    serviceServer.getPublic().catch(() => []),
    getSiteUrl(),
  ]);

  return (
    <main className="md:p-0 p-4 pb-18">
      <LocationForm mode="create" services={services} siteUrl={siteUrl} />
    </main>
  );
}
