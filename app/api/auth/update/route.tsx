import { updateUserController } from "@/modules/user/user.controller";

export async function PUT(req: Request) {
  return updateUserController(req as any);
}
