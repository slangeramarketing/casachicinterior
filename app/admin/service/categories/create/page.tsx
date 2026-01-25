import { Metadata } from "next";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import ServiceCategoryForm from "@/components/admin/clientComponent/service/ServiceCategoryForm";

export const metadata: Metadata = {
  title: "Create Category | Admin",
  robots: { index: false, follow: false },
};

export default async function CreateServiceCategoryPage() {
  /** * Hum direct Server Facade use kar rahe hain 
   * Taki humein categories ki list mile (Parent select karne ke liye)
   */
  const categories = await serviceCategoryServer.getAll();

  return (
    <main className="md:p-0 p-4 pb-18">
      <ServiceCategoryForm
        mode="create"
        categories={categories} // Direct DTO array pass ho raha hai
      />
    </main>
  );
}