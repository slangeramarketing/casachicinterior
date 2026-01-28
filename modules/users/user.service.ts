/***************************************************
 * File: modules/users/user.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains ALL business rules related to Users
 *
 * Responsibilities:
 * - Enforce role-based permissions (RBAC)
 * - Decide what an admin vs super_admin can do
 * - Validate domain-level constraints
 *
 * Restrictions:
 * - Must NOT format data
 * - Must NOT return DTOs
 * - Must NOT access HTTP / cookies
 ***************************************************/

import { userRepository } from "./user.repository";
import {
  UserCreateDTO,
  UserUpdateDTO,
  UserFilterDTO,
  AdminSelfUpdateDTO,
} from "./user.dto";
import { UserRecord, UserRole, UserStatus } from "./user.typs";
import db from "@/lib/db";

/* =================================================
   INTERNAL RBAC HELPERS (DOMAIN RULES)
================================================= */

/**
 * Ensures only super_admin can proceed
 */
function assertSuperAdmin(role: UserRole) {
  if (role !== "super_admin") {
    throw new Error("Only super_admin is allowed to perform this action");
  }
}

/**
 * Ensures admin OR super_admin
 */
function assertAdminOrSuperAdmin(role: UserRole) {
  if (role !== "admin" && role !== "super_admin") {
    throw new Error("Permission denied");
  }
}

/* =================================================
   CREATE
================================================= */

/**
 * Create a new user
 *
 * Rules:
 * - ONLY super_admin can create users
 * - Email must be unique
 * - Status is always set to `active` on creation
 */
export async function createUser(
  actorRole: UserRole,
  data: UserCreateDTO
): Promise<UserRecord> {
  await db();

  assertSuperAdmin(actorRole);

  if (!data.name || !data.email || !data.password) {
    throw new Error("Missing required fields");
  }

  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    throw new Error("Email already exists");
  }

  return userRepository.create({
    ...data,
    status: "active",
  });
}

/* =================================================
   UPDATE — SUPER ADMIN (FULL POWER)
================================================= */

/**
 * Update ANY user (full access)
 *
 * Rules:
 * - ONLY super_admin
 * - Can update:
 *   - name
 *   - email
 *   - role
 *   - status
 *   - profile
 */
export async function updateUserBySuperAdmin(
  actorRole: UserRole,
  userId: string,
  data: UserUpdateDTO
): Promise<UserRecord> {
  await db();

  assertSuperAdmin(actorRole);

  const updated = await userRepository.updateById(userId, data);
  if (!updated) {
    throw new Error("User not found");
  }

  return updated;
}

/* =================================================
   UPDATE — ADMIN SELF PROFILE (LIMITED)
================================================= */

/**
 * Update own profile (admin / super_admin)
 *
 * Rules:
 * - Admin can update ONLY:
 *   - name
 *   - profile image
 * - Email, role, status are NOT allowed here
 */
export async function updateSelfProfile(
  actorRole: UserRole,
  actorUserId: string,
  data: AdminSelfUpdateDTO
): Promise<UserRecord> {
  await db();

  assertAdminOrSuperAdmin(actorRole);

  const updated = await userRepository.updateById(actorUserId, {
    name: data.name,
    profile: data.profile,
  });

  if (!updated) {
    throw new Error("User not found");
  }

  return updated;
}

/* =================================================
   READ — LIST & COUNT (SUPER ADMIN ONLY)
================================================= */

/**
 * List users with filters & pagination
 *
 * Rules:
 * - ONLY super_admin
 */
export async function listUsers(
  actorRole: UserRole,
  filters: UserFilterDTO
): Promise<UserRecord[]> {
  await db();

  assertSuperAdmin(actorRole);

  return userRepository.findAll(
    filters,
    filters.page ?? 1,
    filters.limit ?? 10
  );
}

/**
 * Count users (for dashboard / pagination)
 *
 * Rules:
 * - ONLY super_admin
 */
export async function countUsers(
  actorRole: UserRole,
  filters: UserFilterDTO
): Promise<number> {
  await db();

  assertSuperAdmin(actorRole);

  return userRepository.count(filters);
}

/* =================================================
   READ — GET USER
================================================= */

/**
 * Get user by ID
 *
 * Rules:
 * - super_admin → can get ANY user
 * - admin → allowed ONLY for self profile
 *
 * NOTE:
 * - Caller must ensure:
 *   - admin passes their OWN userId
 */
export async function getUserById(
  actorRole: UserRole,
  userId: string
): Promise<UserRecord> {
  await db();

  assertAdminOrSuperAdmin(actorRole);

  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

/* =================================================
   DELETE
================================================= */

/**
 * Delete user permanently
 *
 * Rules:
 * - ONLY super_admin
 * - Hard delete
 */
export async function deleteUser(
  actorRole: UserRole,
  userId: string
): Promise<void> {
  await db();

  assertSuperAdmin(actorRole);

  const deleted = await userRepository.deleteById(userId);
  if (!deleted) {
    throw new Error("User not found");
  }
}
