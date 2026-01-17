"use server";

import db from "@/lib/db";
/***************************************************
 * File: app/(public)/actions/contact.action.ts
 * Layer: Server Action
 *
 * Purpose:
 * - Public-facing server action for contact form
 *
 * Responsibilities:
 * - Call message server facade
 *
 * Restrictions:
 * - No auth logic
 * - No business logic
 ***************************************************/

import { messageServer } from "@/modules/messages/message.server";

export async function submitContactAction(data: {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
}) {
  await db();
  return messageServer.submitMessage(data);
}
