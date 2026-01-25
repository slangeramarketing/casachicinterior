/***************************************************
 * File: app/admin/service-categories/page.tsx
 * Type: Server Page (Admin)
 ***************************************************/

import { Metadata } from "next";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { PageRouteHeader } from "@/components/common/PageHeader";
import ServiceCategoryList from "@/components/admin/clientComponent/service/ServiceCategoryList";

/* -------------------------------------
   SEO Metadata (Admin specific)
------------------------------------- */
export const metadata: Metadata = {
  title: "Category Management | Admin Dashboard",
  description: "Organize interior design categories and sub-categories.",
  robots: { index: false, follow: false }, 
};

/* -------------------------------------
   Page Component
------------------------------------- */
export default async function ServiceCategoryServerPage() {
  /**
   * Data Fetching: Direct call to Server Facade.
   * Kyunki hum server par hain, direct server layer call karna 
   * speed aur reliability ke liye best hai.
   */
  const categories = await serviceCategoryServer.getAll();

  // Logging for debugging during development
  console.log(`Fetched ${categories?.length || 0} categories for Admin.`);


  return (
    <main className="p-4 md:p-0">
      <div className="flex flex-col gap-2 pb-2">
        <PageRouteHeader />
      </div>
      <ServiceCategoryList
        categories={categories}
      />
    </main>
  );
}