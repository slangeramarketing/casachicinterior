/***************************************************
 * File: modules/messages/message.types.ts
 * Layer: Types
 *
 * Purpose:
 * - Defines plain TypeScript representations of MongoDB records
 *
 * Responsibilities:
 * - Represent raw DB data returned from repository
 *
 * Restrictions:
 * - Must NOT use DTOs
 * - Must NOT format data
 * - Must NOT be exposed to UI
 ***************************************************/

import { Types } from "mongoose";

export interface MessageReplyRecord {
  sender: "admin" | "client";
  message: string;
  repliedAt: Date;
}

export interface MessageRecord {
  _id: Types.ObjectId;

  name: string;
  email: string;
  phone: string;
  city: string;

  message: string;
  replies: MessageReplyRecord[];

  isRead: boolean;
  isReplied: boolean;

  createdAt: Date;
  updatedAt: Date;
}
