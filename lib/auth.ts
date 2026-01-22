

  /* ---------------------------------------
    lib/auth.ts
  ---------------------------------------- */

  import { cookies } from "next/headers";
  import { verifyJwt } from "./jwt";
  import { JwtPayload } from "@/modules/auth/auth.types";

  /**
   * Read auth token from HTTP-only cookie
   * and return verified JWT payload
   *
   * Throws Error if unauthenticated
   */
  export async function requireAuth(): Promise<JwtPayload> {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    console.log("TOKEN: ",token);

    if (!token) {
      throw new Error("UNAUTHORIZED");
    }

    const payload = verifyJwt(token);
    if (!payload) {
      throw new Error("UNAUTHORIZED");
    }

    return payload;
  }

  /**
   * Require authentication + role authorization
   */
  export async function requireRole(
    allowedRoles: Array<"admin" | "super_admin">
  ): Promise<JwtPayload> {
    const payload = await requireAuth();

    if (!allowedRoles.includes(payload.role)) {
      throw new Error("FORBIDDEN");
    }

    return payload;
  }

  /**
   * Optional helper (non-throwing)
   * Useful for layouts / conditional UI
   */
  export async function getAuthUser(): Promise<JwtPayload | null> {
    try {
      return await requireAuth();
    } catch {
      return null;
    }
  }
