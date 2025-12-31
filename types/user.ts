/* =====================================
   USER TYPES & DTO VARIANTS
   File: types/user.ts
===================================== */

/* -------------------------------------
   Core Enums
------------------------------------- */
export type UserRole = "super_admin" | "admin" | "user";
export type UserStatus = "active" | "inactive" | "blocked";

/* -------------------------------------
   INTERNAL BASE SHAPE
------------------------------------- */
interface UserBase {
  _id: string;
  name?: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;
  createdAt: string;
}

/* -------------------------------------
   VARIANT 1: AUTH / LOGIN / ME
------------------------------------- */
export interface UserAuthDTO extends UserBase {}

/* -------------------------------------
   VARIANT 2: ADMIN USER LIST
------------------------------------- */
export interface UserListDTO {
  _id: string;
  name?: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;
}

/* -------------------------------------
   VARIANT 3: ADMIN USER DETAIL
------------------------------------- */
export interface UserAdminDetailDTO extends UserBase {
  updatedAt: string;
}

/* -------------------------------------
   VARIANT 4: PUBLIC / COMMENT / REVIEW
------------------------------------- */
export interface UserPublicMinimalDTO {
  _id: string;
  name?: string;
  avatar?: string;
}

/* -------------------------------------
   VARIANT 5: AUTH TOKEN PAYLOAD
------------------------------------- */
export interface AuthPayloadDTO {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;
}

/* =====================================
   MONGOOSE → PLAIN JS MAPPERS
===================================== */

type MongoUser = {
  _id: any;
  name?: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt?: Date;
};

/* -------------------------------------
   AUTH / LOGIN / ME MAPPER
------------------------------------- */
export function mapUserToAuthDTO(user: MongoUser): UserAuthDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt.toISOString(),
  };
}

/* -------------------------------------
   ADMIN LIST MAPPER
------------------------------------- */
export function mapUserToListDTO(user: MongoUser): UserListDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    isBlocked: user.isBlocked,
  };
}

/* -------------------------------------
   ADMIN DETAIL MAPPER
------------------------------------- */
export function mapUserToAdminDetailDTO(
  user: MongoUser
): UserAdminDetailDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
    status: user.status,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt
      ? user.updatedAt.toISOString()
      : "",
  };
}

/* -------------------------------------
   PUBLIC / MINIMAL MAPPER
------------------------------------- */
export function mapUserToPublicDTO(
  user: MongoUser
): UserPublicMinimalDTO {
  return {
    _id: user._id.toString(),
    name: user.name,
    avatar: user.avatar,
  };
}
