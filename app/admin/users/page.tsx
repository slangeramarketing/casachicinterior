import UserList from "@/components/admin/clientComponent/users/UserList";
import { userServer } from "@/modules/users/user.server";

/* -------------------------------------
   Server Page (NO DB / NO SERVER FACADE)
------------------------------------- */
export default async function UsersPage() {
  const users = await userServer.list({
    page: 1,
    limit: 20,
  });

  return (
    <div className="w-full">
     <UserList users={users} />
  </div>
  );
}
