/***************************************************
 * File: modules/messages/message.model.ts
 * Layer: Model
 *
 * Purpose:
 * - Defines MongoDB schema for client contact messages
 *
 * Responsibilities:
 * - Schema definition only
 *
 * Restrictions:
 * - No business logic
 * - No helpers
 ***************************************************/

import { Schema, model, models } from "mongoose";

const ReplySchema = new Schema(
  {
    sender: {
      type: String,
      enum: ["admin", "client"],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    repliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const MessageSchema = new Schema(
  {
    /* ========================
       CLIENT DETAILS
    ======================== */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    /* ========================
       ROOT MESSAGE
    ======================== */
    message: {
      type: String,
      required: true,
      trim: true,
    },

    /* ========================
       THREAD / REPLIES
    ======================== */
    replies: {
      type: [ReplySchema],
      default: [],
    },

    /* ========================
       META
    ======================== */
    isRead: {
      type: Boolean,
      default: false,
    },

    isReplied: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel =
  models.Message || model("Message", MessageSchema);
