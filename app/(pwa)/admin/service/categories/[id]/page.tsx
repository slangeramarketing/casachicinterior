/***************************************************
 * File: app/admin/service/categories/[id]/page.tsx
 * Type: Server Page
 ***************************************************/

import ServiceCategoryForm from "@/components/admin/clientComponent/service/ServiceCategoryForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";

export const metadata: Metadata = {
  title: "Update Category | Admin",
  robots: { index: false, follow: false },
};

export default async function UpdateServiceCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>; // Next.js 15+ compatible
}) {
  const { id } = await params;

  /* ---------------------------------
      Fetch Data in Parallel
  --------------------------------- */
  const [category, allCategories] = await Promise.all([
    serviceCategoryServer.getById(id),
    serviceCategoryServer.getAll()
  ]);

  if (!category) {
    notFound();
  }

  /* ---------------------------------
      Render with SEO Mapping
  --------------------------------- */
  return (
    <ServiceCategoryForm
      mode="update"
      categories={allCategories}
      initialData={{
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        displayOrder: category.displayOrder,
        status: category.status,
        icon: category.icon, // Icon pass karna mat bhulna
        thumbnail: category.thumbnail, // Purani image edit mode mein dikhane ke liye
        // SEO data ko extract karke flat format mein bhej rahe hain 
        // kyunki humare Client Form ki state flat hai
        metaTitle: category.seo?.title || "", 
        metaDescription: category.seo?.description || "",
      }}
    />
  );
}