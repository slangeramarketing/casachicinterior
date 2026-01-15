/***************************************************
 * File: modules/messages/message.server.ts
 * Layer: Server Facade
 *
 * Purpose:
 * - Next.js adapter for Message module
 *
 * Responsibilities:
 * - Auth & role enforcement
 * - Call service layer only
 * - Apply mapper before returning data
 *
 * Restrictions:
 * - Must NOT access repository
 * - Must NOT contain business logic
 ***************************************************/


import {
  createMessage,
  replyToMessage,
  getAllMessages,
  getMessageById,
  markMessageAsRead,
} from "./message.service";

import { messageMapper } from "./message.mapper";
import { requireRole } from "@/lib/auth";

export const messageServer = {
  /**
   * Purpose:
   * - Public contact form submission
   *
   * Auth:
   * - NOT required
   */
  async submitMessage(data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    message: string;
  }) {
    const record = await createMessage(data);
    return messageMapper.toResponse(record);
  },

  /**
   * Purpose:
   * - Admin: fetch all messages
   *
   * Auth:
   * - admin / super_admin
   */
  async getAll() {
    await requireRole(["admin", "super_admin"]);

    const records = await getAllMessages();
    return records.map(messageMapper.toResponse);
  },

  /**
   * Purpose:
   * - Admin: fetch single message thread
   */
  async getById(messageId: string) {
    await requireRole(["admin", "super_admin"]);

    const record = await getMessageById(messageId);
    return messageMapper.toResponse(record);
  },

  /**
   * Purpose:
   * - Admin: reply to client message
   */
  async reply(messageId: string, message: string) {
    await requireRole(["admin", "super_admin"]);

    const record = await replyToMessage(messageId, message);
    return messageMapper.toResponse(record);
  },

  /**
   * Purpose:
   * - Admin: mark message as read
   */
  async markAsRead(messageId: string) {
    await requireRole(["admin", "super_admin"]);

    const record = await markMessageAsRead(messageId);
    return messageMapper.toResponse(record);
  },
};
