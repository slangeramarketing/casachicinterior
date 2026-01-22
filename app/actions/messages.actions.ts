"use server";

/***************************************************
 * File: app/admin/actions/messages.actions.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Admin-facing server actions for Message module
 *
 * Responsibilities:
 * - Act as UI → server bridge
 * - Call messageServer facade only
 *
 * Restrictions:
 * - NO business logic
 * - NO DB access
 * - NO auth logic (handled in server facade)
 ***************************************************/

import { messageServer } from "@/modules/messages/message.server";

/* ================================
   READ (ADMIN)
================================ */

/**
 * Fetch all messages (admin)
 */
export async function getAllMessagesAction() {
  return messageServer.getAll();
}

/**
 * Fetch single message thread by ID (admin)
 */
export async function getMessageByIdAction(
  messageId: string
) {
  return messageServer.getById(messageId);
}

/* ================================
   WRITE (ADMIN)
================================ */

/**
 * Reply to a message (admin)
 */
export async function replyToMessageAction(
  messageId: string,
  message: string
) {
  return messageServer.reply(messageId, message);
}

/**
 * Mark message as read (admin)
 */
export async function markMessageAsReadAction(
  messageId: string
) {
  return messageServer.markAsRead(messageId);
}
