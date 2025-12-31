import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { UserRole } from "./user.model";

/* -------------------------------------
   Token Payload
------------------------------------- */
export interface AuthPayload {
  id: string;
  email: string;
  role: UserRole;
  status: "active" | "inactive" | "blocked";
  isBlocked: boolean;
}

/* -------------------------------------
   Authenticate User
------------------------------------- */
export function authenticate(req: NextRequest): AuthPayload {
  let token: string | null = null;

  /* 1️⃣ Authorization Header */
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  /* 2️⃣ Cookie fallback */
  if (!token) {
    token = req.cookies.get("token")?.value || null;
  }

  /* 3️⃣ No token */
  if (!token) {
    throw new Error("Unauthorized");
  }

  /* 4️⃣ Verify token */
  const decoded = verifyToken(token) as AuthPayload | null;

  if (!decoded) {
    throw new Error("Invalid or expired token");
  }

  /* 5️⃣ 🔥 BLOCK / STATUS CHECK (MANDATORY) */
  if (decoded.isBlocked || decoded.status !== "active") {
    throw new Error("Account is inactive or blocked");
  }

  return decoded;
}


/* -------------------------------------
   Authorize Roles
------------------------------------- */
export function authorize(
  user: AuthPayload,
  allowedRoles: UserRole[]
) {
  if (!allowedRoles.includes(user.role)) {
    throw new Error("Forbidden: insufficient permissions");
  }
}

