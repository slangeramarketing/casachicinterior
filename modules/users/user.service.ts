/***************************************************
 * File: modules/users/user.service.ts
 * Layer: Service
 ***************************************************/

import { userRepository } from "./user.repository";
import {
  UserCreateDTO,
  UserUpdateDTO,
  UserFilterDTO,
} from "./user.dto";
import { UserRecord, UserRole, UserStatus } from "./user.typs";
import db from "@/lib/db";

/* -------------------------------------
   INTERNAL HELPERS
------------------------------------- */
function assertAdminRole(role: UserRole) {
  if (role !== "super_admin" && role !== "admin") {
    throw new Error("Permission denied");
  }
}

function assertRoleChangeAllowed(
  actorRole: UserRole,
  targetRole?: UserRole
) {
  if (actorRole === "admin" && targetRole === "super_admin") {
    throw new Error("Admin cannot assign super_admin role");
  }
}

/* -------------------------------------
   SERVICE FUNCTIONS
------------------------------------- */

/**
 * Create user
 */
export async function createUser(
  actorRole: UserRole,
  data: UserCreateDTO
): Promise<UserRecord> {
  db();

  assertAdminRole(actorRole);
  assertRoleChangeAllowed(actorRole, data.role);

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

/**
 * Update user
 */
export async function updateUser(
  actorRole: UserRole,
  userId: string,
  data: UserUpdateDTO
): Promise<UserRecord> {
  db();

  assertAdminRole(actorRole);
  assertRoleChangeAllowed(actorRole, data.role);

  const updated = await userRepository.updateById(userId, data);
  if (!updated) throw new Error("User not found");

  return updated;
}

/**
 * Update user status
 */
export async function updateUserStatus(
  actorRole: UserRole,
  userId: string,
  status: UserStatus
): Promise<UserRecord> {
  db();

  assertAdminRole(actorRole);

  const updated = await userRepository.updateStatus(userId, status);
  if (!updated) throw new Error("User not found");

  return updated;
}

/**
 * Delete user permanently
 */
export async function deleteUser(
  actorRole: UserRole,
  userId: string
): Promise<void> {
  db();

  if (actorRole !== "super_admin") {
    throw new Error("Only super_admin can delete users");
  }

  const deleted = await userRepository.deleteById(userId);
  if (!deleted) throw new Error("User not found");
}

/**
 * List users
 */
export async function listUsers(
  actorRole: UserRole,
  filters: UserFilterDTO
): Promise<UserRecord[]> {
  db();

  assertAdminRole(actorRole);

  return userRepository.findAll(
    filters,
    filters.page ?? 1,
    filters.limit ?? 10
  );
}

/**
 * Count users
 */
export async function countUsers(
  actorRole: UserRole,
  filters: UserFilterDTO
): Promise<number> {
  db();

  assertAdminRole(actorRole);
  return userRepository.count(filters);
}

/**
 * Get user by ID
 */
export async function getUserById(
  actorRole: UserRole,
  userId: string
): Promise<UserRecord> {
  db();

  assertAdminRole(actorRole);

  const user = await userRepository.findById(userId);
  if (!user) throw new Error("User not found");

  return user;
}
