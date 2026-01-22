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
  /**
   * Create a new user
   */
  async create(data: Partial<UserRecord>): Promise<UserRecord> {
    const user = await UserModel.create(data);
    return user.toObject(); // ✅ must return plain object
  },

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<UserRecord | null> {
    return UserModel.findById(new Types.ObjectId(id)).lean();
  },

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<UserRecord | null> {
    return UserModel.findOne({ email }).lean();
  },

  /**
   * List users with filters & pagination
   */
  async findAll(
    filters: UserFilter,
    page = 1,
    limit = 10
  ): Promise<UserRecord[]> {
    const query: any = {};

    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { email: { $regex: filters.search, $options: "i" } },
      ];
    }

    return UserModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  },

  /**
   * Update user by ID
   */
async updateById(id: string, data: Partial<UserRecord>): Promise<UserRecord | null> {
  // 1. Security check: Password ko yahan se delete kar dein 
  // taaki general update se password kabhi change na ho
  delete data.password; 

  return UserModel.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $set: data }, // $set sirf unhi fields ko update karega jo data mein hain
    { new: true }
  ).lean();
},

  /**
   * Update user status
   */
  async updateStatus(
    id: string,
    status: UserStatus
  ): Promise<UserRecord | null> {
    return UserModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      { status },
      { new: true }
    ).lean();
  },

  /**
   * Permanently delete user
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(
      new Types.ObjectId(id)
    );
    return !!result;
  },

  /**
   * Count users with filters
   */
  async count(filters: UserFilter): Promise<number> {
    const query: any = {};

    if (filters.role) query.role = filters.role;
    if (filters.status) query.status = filters.status;

    return UserModel.countDocuments(query);
  },
};
