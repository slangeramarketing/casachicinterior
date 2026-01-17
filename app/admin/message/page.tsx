import MessageCardClient from "@/components/clientPage/message/MessageCardClient";
import { getAllMessagesAction } from "../actions/admin.messages.actions";

export default async function MessageServerPage() {
  // 🔐 auth + DB happens inside messageServer
  const messages = await getAllMessagesAction();

  return <MessageCardClient messages={messages} />;
}
