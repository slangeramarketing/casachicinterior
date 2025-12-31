import { deleteUserController } from "@/modules/user/user.controller";

export async function DELETE(req: Request) {
  return deleteUserController(req as any);
}
