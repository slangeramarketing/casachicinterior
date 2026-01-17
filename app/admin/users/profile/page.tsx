import ProfilePage from "@/components/admin/ProfilePage";
import { getAuthUser } from "@/lib/auth";
import { userServer } from "@/modules/users/user.server";
import { getUserByIdAction } from "../../actions/admin.users.action";

export default async function ProfileServerPage() {
  const authUser = await getAuthUser();
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  // 👇 DB se full user lao
  const user = await getUserByIdAction(authUser.userId);

  return <ProfilePage user={user} />;
}
