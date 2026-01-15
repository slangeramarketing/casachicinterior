/***************************************************
 * File: modules/users/user.dto.ts
 * Layer: DTO
 ***************************************************/

export type UserRole = "super_admin" | "admin";
export type UserStatus = "active" | "inactive" | "blocked";

/* CREATE */
export interface UserCreateDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

/* UPDATE */
export interface UserUpdateDTO {
  name?: string;
  profile?: string;
  role?: UserRole;
  status?: UserStatus;
}

/* FILTER */
export interface UserFilterDTO {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  page?: number;
  limit?: number;
}

/* RESPONSE */
export interface UserResponseDTO {
  id: string;
  name: string;
  email: string;
  profile?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/* PARSERS (controller-only helpers) */
export function parseUserRole(
  value: string | null
): UserRole | undefined {
  if (value === "super_admin" || value === "admin") return value;
  return undefined;
}

export function parseUserStatus(
  value: string | null
): UserStatus | undefined {
  if (value === "active" || value === "inactive" || value === "blocked") {
    return value;
  }
  return undefined;
}
