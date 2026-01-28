/***************************************************
 * File: modules/users/user.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all MongoDB operations related to users
 *
 * Responsibilities:
 * - Create, read, update, delete user records
 * - Apply MongoDB queries, filters, pagination
 * - Return plain JavaScript objects (lean records)
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or mappers
 * - Must NOT format data or apply domain rules
 * - Must NOT expose Mongoose Documents
 *
 * Note:
 * - This file exports a stateless object with methods
 ***************************************************/
/***************************************************
 * File: modules/users/user.repository.ts
 * Layer: Repository
 ***************************************************/

import { Types } from "mongoose";
import UserModel from "./user.model";
import { UserRecord, UserRole, UserStatus } from "./user.typs";

/* -------------------------------------
   INTERNAL FILTER TYPE
------------------------------------- */
interface UserFilter {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
}

/* -------------------------------------
   USER REPOSITORY
------------------------------------- */
export const userRepository = {
  /* =============================
      CREATE
  ============================= */

  async create(data: Partial<UserRecord>): Promise<UserRecord> {
    const doc = await UserModel.create(data);
    return doc.toObject();
  },

  /* =============================
      READ
  ============================= */

  async findById(id: string): Promise<UserRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return UserModel.findById(id)
      .lean<UserRecord>()
      .exec();
  },

  async findByEmail(email: string): Promise<UserRecord | null> {
    if (!email) return null;

    return UserModel.findOne({ email })
      .lean<UserRecord>()
      .exec();
  },

  async findAll(
    filters: UserFilter = {},
    page = 1,
    limit = 10
  ): Promise<UserRecord[]> {
    const query: any = {};

    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    if (filters.search?.trim()) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    return UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean<UserRecord[]>()
      .exec();
  },

  /* =============================
      UPDATE
  ============================= */

  async updateById(
    id: string,
    data: Partial<UserRecord>
  ): Promise<UserRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    // 🔒 Password update is NOT allowed here
    if ("password" in data) {
      delete (data as any).password;
    }

    return UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .lean<UserRecord>()
      .exec();
  },

  async updateStatus(
    id: string,
    status: UserStatus
  ): Promise<UserRecord | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .lean<UserRecord>()
      .exec();
  },

  /* =============================
      DELETE
  ============================= */

  async deleteById(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const res = await UserModel.findByIdAndDelete(id).exec();
    return !!res;
  },

  /* =============================
      COUNT
  ============================= */

  async count(filters: UserFilter = {}): Promise<number> {
    const query: any = {};

    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    return UserModel.countDocuments(query).exec();
  },
};
