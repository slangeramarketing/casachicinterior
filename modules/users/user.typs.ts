/***************************************************
 * File: modules/users/user.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Raw DB record types (repository ↔ service)
 ***************************************************/

import { Types } from "mongoose";

export type UserRole = "super_admin" | "admin";
export type UserStatus = "active" | "inactive" | "blocked";

export interface UserRecord {
  _id: Types.ObjectId;

  name: string;
  email: string;
  profile?: string;

  role: UserRole;
  status: UserStatus;

  password?: string;

  createdAt: Date;
  updatedAt: Date;
}
