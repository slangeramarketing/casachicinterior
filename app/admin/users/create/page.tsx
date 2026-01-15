import { userServer } from "@/modules/users/user.server";
import UserForm from "@/components/clientPage/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";

export default function CreateUserPage() {
  
  async function handleCreate(data: {
    name: string;
    email: string;
    password: string;
    role: "super_admin" | "admin";
  }) {
    "use server";
    await userServer.create(data);
  }

  return (
    <div className="w-full flex flex-col">
      <div className="px-4">
        <PageRouteHeader/>
        <PageTitle title="Create User" description="Create users from this form" />
      </div>
      <div>
        <UserForm mode="create" onSubmit={handleCreate} />
      </div>
    </div>
  );

}
