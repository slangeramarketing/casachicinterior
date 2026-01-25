import MessageCardClient from "@/components/admin/clientComponent/message/MessageCardClient";
import { getAllMessagesAction } from "../../../actions/messages.actions";

export default async function MessageServerPage() {
  // 🔐 auth + DB happens inside messageServer
  const messages = await getAllMessagesAction();

  return <MessageCardClient messages={messages} />;
}
