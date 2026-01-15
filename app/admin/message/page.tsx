import MessageCardClient from "@/components/clientPage/message/MessageCardClient";
import { messageServer } from "@/modules/messages/message.server";

export default async function MessageServerPage() {
  // 🔐 auth + DB happens inside messageServer
  const messages = await messageServer.getAll();

  return <MessageCardClient messages={messages} />;
}
