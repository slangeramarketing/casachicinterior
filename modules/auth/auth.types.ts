/***************************************************
 * File: modules/auth/auth.types.ts
 * Layer: Types (Internal Auth Records)
 *
 * Purpose:
 * - Define internal auth-related data contracts
 *
 * Responsibilities:
 * - Represent raw user data required for authentication
 *
 * Restrictions:
 * - Must NEVER be exposed to UI or controllers
 ***************************************************/


import { UserStatus } from "../users/user.typs";

export type Role = "super_admin" | "admin";

/**
 * Internal auth user record
 * Used ONLY inside auth service
 */
export interface AuthUserInternal {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
}

/**
 * JWT payload structure
 */
export interface JwtPayload {
  userId: string;
  role: Role;
  iat?: number;
  exp?: number;
}
