import ProfilePage from "@/components/admin/clientComponent/users/ProfilePage";
import { getAuthUser } from "@/lib/auth";
import { userServer } from "@/modules/users/user.server";

export default async function ProfileServerPage() {
  const authUser = await getAuthUser();
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  // 👇 DB se full user lao by Id
  const user = await userServer.getById(authUser.userId);

  return <ProfilePage user={user} />;
}
