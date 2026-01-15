/* ---------------------------------------
   modules/auth/auth.middleware.ts
---------------------------------------- */

import { verifyJwt } from "@/lib/jwt";
import { JwtPayload, Role } from "./auth.types";

export interface AuthResult {
  ok: boolean;
  payload?: JwtPayload;
  error?: "UNAUTHORIZED" | "FORBIDDEN";
}

export function authorize(
  token: string | undefined,
  allowedRoles?: Role[]
): AuthResult {
  if (!token) return { ok: false, error: "UNAUTHORIZED" };

  const payload = verifyJwt(token);
  if (!payload) return { ok: false, error: "UNAUTHORIZED" };

  if (allowedRoles && !allowedRoles.includes(payload.role)) {
    // console.log("Payload Role: ",payload.role);
    return { ok: false, error: "FORBIDDEN" };
  }

  // console.log("payload: ",payload);

  return { ok: true, payload };
}
