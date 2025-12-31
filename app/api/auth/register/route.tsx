import { registerController } from "@/modules/user/user.controller";

export async function POST(req: Request) {
  return registerController(req as any);
}
