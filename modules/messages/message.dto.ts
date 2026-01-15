/***************************************************
 * File: modules/messages/message.dto.ts
 * Layer: DTO
 *
 * Purpose:
 * - Defines input and output contracts for Message module
 *
 * Responsibilities:
 * - Client-safe request and response structures
 *
 * Restrictions:
 * - Must NOT use ObjectId
 * - Must NOT use Date objects
 ***************************************************/

/* =========================
   CREATE (Client → Server)
========================= */
export interface CreateMessageDTO {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}

/* =========================
   ADMIN REPLY
========================= */
export interface ReplyMessageDTO {
  messageId: string;
  message: string;
}

/* =========================
   RESPONSE DTOs
========================= */
export interface MessageReplyResponseDTO {
  sender: "admin" | "client";
  message: string;
  repliedAt: string;
}

export interface MessageResponseDTO {
  id: string;

  name: string;
  email: string;
  phone: string;
  city: string;

  message: string;
  replies: MessageReplyResponseDTO[];

  isRead: boolean;
  isReplied: boolean;

  createdAt: string;
  updatedAt: string;
}
