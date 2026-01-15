import { updateUserController } from "@/modules/users/user.controller";

export async function PUT(req: Request) {
  return updateUserController(req as any);
}
