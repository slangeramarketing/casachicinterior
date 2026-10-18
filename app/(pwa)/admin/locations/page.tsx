/***************************************************
 * File: app/(pwa)/admin/locations/page.tsx
 * Type: Server Page (Admin)
 ***************************************************/

import { Metadata } from "next";
import { locationServer } from "@/modules/locations/location.server";
import { PageRouteHeader } from "@/components/common/PageHeader";
import LocationList from "@/components/admin/clientComponent/locations/LocationList";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = {
  title: "Location Pages | Admin Dashboard",
  description: "Manage area landing pages for the public website.",
  robots: { index: false, follow: false },
};

export default async function AdminLocationsPage() {
  const [locations, siteUrl] = await Promise.all([locationServer.getAll(), getSiteUrl()]);

  return (
    <main className="p-4 md:p-0">
      <div className="flex flex-col gap-2 pb-2">
        <PageRouteHeader />
      </div>
      <LocationList locations={locations} siteUrl={siteUrl} />
    </main>
  );
}
