import { Metadata } from "next";
import { notFound } from "next/navigation";
import LocationForm from "@/components/admin/clientComponent/locations/LocationForm";
import { locationServer } from "@/modules/locations/location.server";
import { serviceServer } from "@/modules/services/service.server";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = {
  title: "Edit Location Page | Admin",
  robots: { index: false, follow: false },
};

export default async function UpdateLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [location, services, siteUrl] = await Promise.all([
    locationServer.getById(id).catch(() => null),
    serviceServer.getPublic().catch(() => []),
    getSiteUrl(),
  ]);

  if (!location) notFound();

  return (
    <main className="md:p-0 p-4 pb-18">
      <LocationForm mode="update" initialData={location} services={services} siteUrl={siteUrl} />
    </main>
  );
}
