import UserList from "@/components/clientPage/users/UserList";
import { listUsersAction } from "../actions/admin.users.action";

/* -------------------------------------
   Server Page (NO DB / NO SERVER FACADE)
------------------------------------- */
export default async function UsersPage() {
  const users = await listUsersAction({
    page: 1,
    limit: 20,
  });

  return <UserList users={users} />;
}
