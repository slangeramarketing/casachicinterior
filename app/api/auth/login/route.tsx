import db from "@/lib/db";
import { loginController } from "@/modules/user/user.controller";

export async function POST(req: Request) {
  db();
  return loginController(req as any);
}
