import ServiceCategoryList, {
  CategoryItem,
} from "@/components/clientPage/services/ServiceCategoryList";
import { serviceCategoryServer } from "@/modules/service-category/service-category.server";
import { deleteServiceCategoryAction, getAllServiceCategoriesAction } from "../../actions/admin.service-categories.actions";

/* =====================================================
   Server Page
===================================================== */
export default async function ServiceCategoryServerPage() {
  /* =============================
     Fetch from DB (REAL DATA)
  ============================= */
  const categories = await getAllServiceCategoriesAction();
  console.log("Category Data: ", categories);

  /* =============================
     Server Action: Delete
  ============================= */
  async function handleDelete(id: string) {
    await deleteServiceCategoryAction(id);
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
