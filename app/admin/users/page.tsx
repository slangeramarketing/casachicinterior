import { getAllUsers } from "@/modules/user/user.service";
import UserList from "@/components/clientPage/users/UserList";

/* -------------------------------------
   Server Page
------------------------------------- */
export default async function UsersPage() {
  /*
    Server-side DB fetch
  */
  const { users } = await getAllUsers({
    page: 1,
    limit: 20,
  });

  return <UserList users={users} />;
}
