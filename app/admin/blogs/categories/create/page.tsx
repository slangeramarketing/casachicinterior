import CategoryForm from "@/components/admin/CategoryForm";
import { PageRouteHeader } from "@/components/common/PageHeader";


export default function CreateCategoryPage() {
  return (
    <div className="w-full flex flex-col justify-items-center justify-center items-center">
      <div className="w-full px-4">
        <PageRouteHeader/>
      </div>
      <div className="pt-6 w-1/2">
        <h1 className="text-2xl font-semibold mb-4">
          Create Category
        </h1>

        <CategoryForm />
      </div>
    </div>
  );
}
