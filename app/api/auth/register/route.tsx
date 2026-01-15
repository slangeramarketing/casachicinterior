import { registerController } from "@/modules/users/user.controller";

export async function POST(req: Request) {
  return registerController(req as any);
}
