import { Metadata } from "next";
import { notFound } from "next/navigation";
import { seoServer } from "@/modules/seo/seo.server";
import PageSeoForm from "@/components/admin/clientComponent/seo/PageSeoForm";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export const metadata: Metadata = {
  title: "Edit Page SEO | Admin",
  robots: { index: false, follow: false },
};

export default async function UpdatePageSeoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [entry, entries, siteUrl] = await Promise.all([
    seoServer.getById(id).catch(() => null),
    seoServer.getAll(),
    getSiteUrl(),
  ]);

  if (!entry) notFound();

  const usedRoutes = entries.filter((e) => e.id !== entry.id).map((e) => e.route);

  return (
    <main className="md:p-0 p-4 pb-18">
      <PageSeoForm mode="update" usedRoutes={usedRoutes} initialData={entry} siteUrl={siteUrl} />
    </main>
  );
}
