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
import db from "@/lib/db";

export async function loginService(
  dto: LoginDTO
): Promise<{ token: string; user: AuthUserDTO }> {
  await db();   // before mongoose queries;
  const user = await authRepository.findByEmailWithPassword(dto.email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (user.status !== "active") {
    throw new Error("ACCOUNT_DISABLED");
  }


  // 🔐 ADMIN ACCESS ONLY
  if (!["admin", "super_admin"].includes(user.role)) {
    throw new Error("NOT_AUTHORIZED");
  }

  const isValidPassword = await bcrypt.compare(
    dto.password,
    user.passwordHash
  );


  if (!isValidPassword) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = signJwt(payload);

  return {
    token,
    user: {
      id:user.id,
      email:user.email,
      role:user.role,
    },
  };
}
