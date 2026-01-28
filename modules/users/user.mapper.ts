/***************************************************
 * File: modules/users/user.mapper.ts
 * Layer: Mapper
 ***************************************************/

import { UserResponseDTO } from "./user.dto";
import { UserRecord } from "./user.typs";
import { AppError } from "@/lib/errors/AppError";

export const userMapper = {
  toResponse(record: UserRecord): UserResponseDTO {
    if (!record || !record._id) {
      throw new AppError({
        message: "Invalid user record passed to mapper",
        code: "MAPPER_INVALID_RECORD",
        statusCode: 500,
        context: { record },
      });
    }

    return {
      id: record._id.toString(),
      name: record.name,
      email: record.email,
      profile: record.profile,
      role: record.role,
      status: record.status,

      createdAt:
        record.createdAt instanceof Date
          ? record.createdAt.toISOString()
          : String(record.createdAt),

      updatedAt:
        record.updatedAt instanceof Date
          ? record.updatedAt.toISOString()
          : String(record.updatedAt),
    };
  },

  toResponseList(records: UserRecord[]): UserResponseDTO[] {
    return records.map((r) => this.toResponse(r));
  },
};
