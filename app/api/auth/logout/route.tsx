import { logoutController } from "@/modules/user/user.controller";

export async function POST() {
  return logoutController();
}
