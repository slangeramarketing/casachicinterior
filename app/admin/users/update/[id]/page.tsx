
import UserForm from "@/components/admin/clientComponent/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import { userServer } from "@/modules/users/user.server";

export default async function UpdateUserServerPage({
  params,
}: {
  params: { id: string };
}) {

  const {id}= await params;

  const user = await userServer.getById(id); // example

  if (!user) throw new Error("User not found");


  return (
     <div className="w-full flex flex-col">
       <div className="px-4">
        <PageRouteHeader/>
        <PageTitle title="Update User" description="Update all users from this form" />
       </div>
       <div>
          <UserForm
            mode="update"
            initialData={user}
          />
       </div>
     </div>
  );
}
