import { deleteUserController } from "@/modules/users/user.controller";

export async function DELETE(req: Request) {
  return deleteUserController(req as any);
}
