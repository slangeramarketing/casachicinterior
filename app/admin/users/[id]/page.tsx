
import UserForm from "@/components/clientPage/users/UserForm";
import { getUserById } from "@/modules/user/user.service";

/* -------------------------------------
   Update User Page (Server)
------------------------------------- */
export default async function UpdateUserPage({
  params,
}: {
  params: Promise<{id:string}>;
}) {
  const {id}= await params;
  const user = await getUserById(id);

  return (
    <UserForm
      mode="update"
      userId={id}
      initialData={{
        name: user.name!,
        email: user.email,
        role: user.role,
      }}
    />
  );
}
