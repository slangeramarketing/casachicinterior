/***************************************************
 * File: modules/messages/message.repository.ts
 * Layer: Repository
 *
 * Purpose:
 * - Handles all MongoDB operations for messages
 *
 * Responsibilities:
 * - Create message records
 * - Update message threads (replies, flags)
 * - Fetch message records
 *
 * Restrictions:
 * - Must NOT contain business logic
 * - Must NOT import DTOs or mappers
 * - Must return plain JS objects only
 ***************************************************/

import { MessageModel } from "./message.model";
import { MessageRecord } from "./message.types";
import { Types } from "mongoose";

export const messageRepository = {
  /**
   * Purpose:
   * - Create a new client message
   *
   * Returns:
   * - Plain message record
   */
  async create(data: {
    name: string;
    email: string;
    phone: string;
    city: string;
    message: string;
  }): Promise<MessageRecord> {
    const doc = await MessageModel.create({
      ...data,
      replies: [],
      isRead: false,
      isReplied: false,
    });

    return doc.toObject();
  },

  /**
   * Purpose:
   * - Add a reply to an existing message thread
   *
   * Returns:
   * - Updated plain message record
   */
  async addReply(
    messageId: string,
    reply: { sender: "admin" | "client"; message: string }
  ): Promise<MessageRecord | null> {
    const updated = await MessageModel.findByIdAndUpdate(
      new Types.ObjectId(messageId),
      {
        $push: {
          replies: {
            sender: reply.sender,
            message: reply.message,
            repliedAt: new Date(),
          },
        },
        $set: {
          isReplied: true,
          isRead: true,
        },
      },
      { new: true }
    ).lean();

    return updated as MessageRecord | null;
  },

  /**
   * Purpose:
   * - Mark message as read
   */
  async markAsRead(
    messageId: string
  ): Promise<MessageRecord | null> {
    const updated = await MessageModel.findByIdAndUpdate(
      new Types.ObjectId(messageId),
      { isRead: true },
      { new: true }
    ).lean();

    return updated as MessageRecord | null;
  },

  /**
   * Purpose:
   * - Fetch all messages (latest first)
   */
  async findAll(): Promise<MessageRecord[]> {
    const records = await MessageModel.find()
      .sort({ createdAt: -1 })
      .lean();

    return records as MessageRecord[];
  },

  /**
   * Purpose:
   * - Fetch single message by ID
   */
  async findById(
    messageId: string
  ): Promise<MessageRecord | null> {
    const record = await MessageModel.findById(
      new Types.ObjectId(messageId)
    ).lean();

    return record as MessageRecord | null;
  },
};
