import { Metadata } from "next";
import { seoServer } from "@/modules/seo/seo.server";
import PageSeoForm from "@/components/admin/clientComponent/seo/PageSeoForm";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { isManagedRoute } from "@/lib/seo/managedPages";

export const metadata: Metadata = {
  title: "Add Page SEO | Admin",
  robots: { index: false, follow: false },
};

export default async function CreatePageSeoPage({
  searchParams,
}: {
  searchParams: Promise<{ route?: string }>;
}) {
  const [{ route }, entries, siteUrl] = await Promise.all([
    searchParams,
    seoServer.getAll(),
    getSiteUrl(),
  ]);

  const usedRoutes = entries.map((e) => e.route);
  const presetRoute =
    route && isManagedRoute(route) && !usedRoutes.includes(route) ? route : undefined;

  return (
    <main className="md:p-0 p-4 pb-18">
      <PageSeoForm mode="create" usedRoutes={usedRoutes} presetRoute={presetRoute} siteUrl={siteUrl} />
    </main>
  );
}
