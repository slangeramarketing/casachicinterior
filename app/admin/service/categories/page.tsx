import ServiceCategoryList, {
  CategoryItem,
} from "@/components/clientPage/services/ServiceCategoryList";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";

/* =====================================================
   Server Page
===================================================== */
export default async function ServiceCategoryServerPage() {
  /* =============================
     Fetch from DB (REAL DATA)
  ============================= */
  const categories = await serviceCategoryServer.getAll();
  console.log("Category Data: ", categories);

  /* =============================
     Server Action: Delete
  ============================= */
  async function handleDelete(id: string) {
    "use server";
    await serviceCategoryServer.remove(id);
  }

  /* =============================
     Render
  ============================= */
  return (
    <ServiceCategoryList
      categories={categories as CategoryItem[]}
      onDelete={handleDelete}
    />
  );
}
