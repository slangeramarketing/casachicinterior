
import UserForm from "@/components/clientPage/users/UserForm";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import { getUserByIdAction } from "@/app/admin/actions/admin.users.action";

export default async function UpdateUserPage({
  params,
}: {
  params: { id: string };
}) {

  const {id}= await params;

  const user = await getUserByIdAction(id); // example

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
