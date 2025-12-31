"use server"
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { UserRole } from "@/modules/user/user.model";
import { UserStatus } from "@/types/user";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;
}

export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies(); // ✅ await REQUIRED
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  const decoded = verifyToken(token) as AuthUser | null;

  if (!decoded) return null;

   // 🔐 Account state check
  if (decoded.isBlocked || decoded.status !== "active") {
    return null;
  }

  return decoded;
}
