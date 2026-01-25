"use client";

import { useState } from "react";

import MessageCard from "@/components/admin/MessageCard";
import FilterDropdown from "@/components/common/FilterDropdown";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { replyMessageAction } from "@/app/admin/message/actions/reply-message.action";

/* =========================
   TYPES
========================= */
interface MessageReply {
  sender: "admin" | "client";
  message: string;
  repliedAt: string;
}

interface MessageThread {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  message: string;
  city:string;
  replies: MessageReply[];
}

interface Props {
  messages: MessageThread[];
}




/* =========================
   PAGE
========================= */
export default function MessageCardClient({messages}:Props) {
  const [filter, setFilter] = useState("new");
  const [items, setItems] = useState<MessageThread[]>(messages);
  const [search, setSearch] = useState("");


  async function handleReply(id: string, reply: string) {
    // 1️⃣ call server action
    const updatedMessage = await replyMessageAction(id, reply);

    // 2️⃣ merge updated thread into UI state
    setItems((prev) =>
      prev.map((msg) =>
        msg.id === updatedMessage.id ? updatedMessage : msg
      )
    );
  }

  const filteredItems = items
  .filter((msg) => {
    if (!search.trim()) return true;

    const q = search.toLowerCase();

    return (
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
    );
  })
  .sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    switch (filter) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "old":
        return aTime - bTime;
      case "new":
      default:
        return bTime - aTime;
    }
  });


  return (
    <section className="min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 justify-between pb-2">
        <PageRouteHeader />
        <div className="flex gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search messages..."
           />

          <FilterDropdown
            value={filter}
            onChange={setFilter}
            options={[
              { label: "A to Z", value: "az" },
              { label: "Z to A", value: "za" },
              { label: "New", value: "new" },
              { label: "Old", value: "old" },
            ]}
          />
        </div>
      </div>

      <div className="w-full pb-8">
        <PageTitle
          title="Messages"
          description="People who contacted you via the website"
        />
      </div>

      <div className="w-full flex flex-col gap-y-8">
        {filteredItems.map((msg) => (
          <MessageCard
            key={msg.id}
            data={msg}
            onReplySubmit={handleReply}
            />
        ))}
      </div>
    </section>
  );
}
