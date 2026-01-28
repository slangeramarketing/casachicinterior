/***************************************************
 * File: modules/auth/auth.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Handle authentication business logic
 *
 * Responsibilities:
 * - Credential validation
 * - Role authorization
 * - JWT generation
 *
 * Restrictions:
 * - Must NOT format HTTP response
 * - Must NOT access cookies
 ***************************************************/
/***************************************************
 * File: modules/auth/auth.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Handle authentication business logic
 *
 * Responsibilities:
 * - Credential validation
 * - Role authorization
 * - JWT generation
 *
 * Restrictions:
 * - Must NOT format HTTP response
 * - Must NOT access cookies
 ***************************************************/

import bcrypt from "bcrypt";
import { signJwt } from "@/lib/jwt";
import { authRepository } from "./auth.repository";
import type { LoginDTO, AuthUserDTO } from "./auth.dto";
import type { JwtPayload } from "./auth.types";
import { AppError } from "@/lib/errors/AppError";
import db from "@/lib/db";

export async function loginService(
  dto: LoginDTO
): Promise<{ token: string; user: AuthUserDTO }> {
  await db();

  /* =========================
     1. Fetch user
  ========================= */
  const user = await authRepository.findByEmailWithPassword(dto.email);

  if (!user) {
    throw new AppError({
      message: "Invalid email or password",
      code: "AUTH_INVALID_CREDENTIALS",
      statusCode: 401,
      context: { email: dto.email },
    });
  }

  /* =========================
     2. Account status check
  ========================= */
  if (user.status !== "active") {
    throw new AppError({
      message: "Account is disabled",
      code: "AUTH_ACCOUNT_DISABLED",
      statusCode: 403,
      context: { userId: user.id, status: user.status },
    });
  }

  /* =========================
     3. Role authorization
  ========================= */
  if (!["admin", "super_admin"].includes(user.role)) {
    throw new AppError({
      message: "Not authorized to access admin panel",
      code: "AUTH_NOT_AUTHORIZED",
      statusCode: 403,
      context: { userId: user.id, role: user.role },
    });
  }

  /* =========================
     4. Password verification
  ========================= */
  const isValidPassword = await bcrypt.compare(
    dto.password,
    user.passwordHash
  );

  if (!isValidPassword) {
    throw new AppError({
      message: "Invalid email or password",
      code: "AUTH_INVALID_CREDENTIALS",
      statusCode: 401,
      context: { email: dto.email },
    });
  }

  /* =========================
     5. JWT generation
  ========================= */
  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = signJwt(payload);

  /* =========================
     6. Return safe payload
  ========================= */
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
