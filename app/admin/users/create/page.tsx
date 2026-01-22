import UserForm from "@/components/admin/clientComponent/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";

export default function CreateUserServerPage() {
  return (
    <div className="w-full flex flex-col">
      <div className="px-4">
        <PageRouteHeader/>
        <PageTitle title="Create User" description="Create users from this form" />
      </div>
      <div>
        <UserForm mode="create" />
      </div>
    </div>
  );

}
