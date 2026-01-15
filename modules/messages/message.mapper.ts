/***************************************************
 * File: modules/messages/message.mapper.ts
 * Layer: Mapper
 *
 * Purpose:
 * - Converts DB records into client-safe DTOs
 *
 * Responsibilities:
 * - ObjectId → string
 * - Date → ISO string
 *
 * Restrictions:
 * - Must NOT access database
 * - Must NOT contain business logic
 ***************************************************/

import {
  MessageRecord,
  MessageReplyRecord,
} from "./message.types";

import {
  MessageResponseDTO,
  MessageReplyResponseDTO,
} from "./message.dto";

export const messageMapper = {
  /**
   * Purpose:
   * - Maps a single reply record to response DTO
   *
   * Used By:
   * - Message mapper
   */
  toReplyResponse(
    reply: MessageReplyRecord
  ): MessageReplyResponseDTO {
    return {
      sender: reply.sender,
      message: reply.message,
      repliedAt: reply.repliedAt.toISOString(),
    };
  },

  /**
   * Purpose:
   * - Maps message DB record to response DTO
   *
   * Used By:
   * - Controller / Server Facade
   */
  toResponse(
    record: MessageRecord
  ): MessageResponseDTO {
    return {
      id: record._id.toString(),

      name: record.name,
      email: record.email,
      phone: record.phone,
      city: record.city,

      message: record.message,
      replies: record.replies.map(
        messageMapper.toReplyResponse
      ),

      isRead: record.isRead,
      isReplied: record.isReplied,

      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  },
};
