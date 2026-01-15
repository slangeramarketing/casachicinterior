import { userServer } from "@/modules/users/user.server";

import UserForm from "@/components/clientPage/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";

export default async function UpdateUserPage({
  params,
}: {
  params: { id: string };
}) {

  const {id}= await params;
  console.log("ID: ",id);

  const users = await userServer.list({ page: 1, limit: 1 }); // example
  const user = users.find((u) => u.id === id);

  if (!user) throw new Error("User not found");

  async function handleUpdate(data: {
    name: string;
    role: "super_admin" | "admin";
  }) {
    "use server";
    await userServer.update(id, data);
  }

  return (
     <div className="w-full flex flex-col">
       <div className="px-4">
        <PageRouteHeader/>
        <PageTitle title="Update User" description="Update all users from this form" />
       </div>
       <div>
          <UserForm
            mode="update"
            
            initialData={{
              name: user.name,
              email: user.email,
              role: user.role,
            }}
            onSubmit={handleUpdate}
          />
       </div>
     </div>
  );
}
