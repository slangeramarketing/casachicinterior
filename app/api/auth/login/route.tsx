import db from "@/lib/db";
import { authController } from "@/modules/auth/auth.controller";

export async function POST(req: Request) {
  db();
  return authController.login(req as any);
}
