import { userServer } from "@/modules/users/user.server";
import UserList from "@/components/clientPage/users/UserList";

/* -------------------------------------
   Server Page
------------------------------------- */
export default async function UsersPage() {
  const users = await userServer.list({
    page: 1,
    limit: 20,
  });

  async function handleDelete(userId: string) {
    "use server";
    await userServer.delete(userId);
  }

  return <UserList users={users} onDelete={handleDelete} />;
}
