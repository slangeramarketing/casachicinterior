import UserForm from "@/components/clientPage/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";

export default function CreateUserPage() {
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
