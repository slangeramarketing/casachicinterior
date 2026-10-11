/***************************************************
 * File: app/(pwa)/admin/seo/page.tsx
 * Type: Server Page (Admin)
 ***************************************************/

import { Metadata } from "next";
import { seoServer } from "@/modules/seo/seo.server";
import { PageRouteHeader } from "@/components/common/PageHeader";
import PageSeoList from "@/components/admin/clientComponent/seo/PageSeoList";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = {
  title: "Page SEO | Admin Dashboard",
  description: "Manage titles, descriptions and keywords for the public website.",
  robots: { index: false, follow: false },
};

export default async function AdminSeoPage() {
  const [entries, siteUrl] = await Promise.all([seoServer.getAll(), getSiteUrl()]);

  return (
    <main className="p-4 md:p-0">
      <div className="flex flex-col gap-2 pb-2">
        <PageRouteHeader />
      </div>
      <PageSeoList entries={entries} siteUrl={siteUrl} />
    </main>
  );
}
