/***************************************************
 * File: modules/users/user.mapper.ts
 * Layer: Mapper
 ***************************************************/

import { UserResponseDTO } from "./user.dto";
import { UserRecord } from "./user.typs";

export const userMapper = {
  toResponse(record: UserRecord): UserResponseDTO {
    return {
      id: record._id.toString(),
      name: record.name,
      email: record.email,
      profile: record.profile,
      role: record.role,
      status: record.status,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },

  toResponseList(records: UserRecord[]): UserResponseDTO[] {
    return records.map(this.toResponse);
  },
};
