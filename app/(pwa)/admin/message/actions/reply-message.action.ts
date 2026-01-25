"use server";

import { messageServer } from "@/modules/messages/message.server";

export async function replyMessageAction(
  messageId: string,
  reply: string
) {
  return messageServer.reply(messageId, reply);
}
