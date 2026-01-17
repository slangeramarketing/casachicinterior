/***************************************************
 * File: modules/messages/message.service.ts
 * Layer: Service
 *
 * Purpose:
 * - Contains all business logic for Message module
 *
 * Responsibilities:
 * - Validation
 * - Domain rules
 * - Repository orchestration
 *
 * Restrictions:
 * - Must NOT format response
 * - Must NOT return DTOs
 * - Must NOT use object + method structure
 ***************************************************/

import { sendMail } from "@/lib/email/mailer";
import { messageRepository } from "./message.repository";
import { MessageRecord } from "./message.types";
import { buildNewContactEmail } from "@/lib/email/templates/new-contact";
import { buildReplyToClientEmail } from "@/lib/email/templates/reply-to-client";
import db from "@/lib/db";

/**
 * Purpose:
 * - Handle client contact form submission
 *
 * Used By:
 * - Server Facade (public contact form)
 */
export async function createMessage(
  data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    message: string;
  }
): Promise<MessageRecord> {
  await db();   // before mongoose queries;

  if (
    !data.name ||
    !data.email ||
    !data.phone ||
    !data.city ||
    !data.message
  ) {
    throw new Error("All fields are required");
  }

  // ✅ 1. SAVE TO DB (source of truth)
  const record = await messageRepository.create(data);

  // ✅ 2. SEND EMAIL (side-effect)
  await sendMail({
    to: process.env.MAIL_TO!, // business email
    subject: "New Enquiry Received – CasaChic Interior",
    html: buildNewContactEmail({
      name: record.name,
      email: record.email,
      phone: record.phone,
      city: record.city,
      message: record.message,
    }),
  });

  // ✅ 3. RETURN DB RECORD
  return record;
}

/**
 * Purpose:
 * - Admin replies to a message thread
 *
 * Used By:
 * - Admin server facade
 */
export async function replyToMessage(
  messageId: string,
  replyMessage: string
): Promise<MessageRecord> {
  await db();   // before mongoose queries;

  if (!replyMessage.trim()) {
    throw new Error("Reply message cannot be empty");
  }

  const updated = await messageRepository.addReply(
    messageId,
    {
      sender: "admin",
      message: replyMessage,
    }
  );

  if (!updated) {
    throw new Error("Message not found");
  }

  // 2️⃣ Send reply email to client (side-effect)
  await sendMail({
    to: updated.email, 
    subject: "Response from CasaChic Interior – Your Enquiry",
    html: buildReplyToClientEmail({
      clientName: updated.name,
      adminReply: replyMessage,
      originalMessage: updated.message,
    }),
  });

  return updated;
}

/**
 * Purpose:
 * - Fetch all messages (admin inbox)
 */
export async function getAllMessages(): Promise<MessageRecord[]> {
  await db();   // before mongoose queries;
  return messageRepository.findAll();
}

/**
 * Purpose:
 * - Fetch a single message thread
 */
export async function getMessageById(
  messageId: string
): Promise<MessageRecord> {
  await db();   // before mongoose queries;
  const record = await messageRepository.findById(messageId);

  if (!record) {
    throw new Error("Message not found");
  }

  return record;
}

/**
 * Purpose:
 * - Mark message as read
 */
export async function markMessageAsRead(
  messageId: string
): Promise<MessageRecord> {
  await db();   // before mongoose queries;
  const updated =
    await messageRepository.markAsRead(messageId);

  if (!updated) {
    throw new Error("Message not found");
  }

  return updated;
}
