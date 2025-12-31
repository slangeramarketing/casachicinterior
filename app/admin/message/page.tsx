"use client";

import MessageCard, { Message } from "@/components/admin/MessageCard";
import FilterDropdown from "@/components/common/FilterDropdown";
import { PageRouteHeader } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { useState } from "react";

export default function AdminMessagePage() {
  const [filter, setFilter] = useState("new");
  const messages: Message[] = [
    {
      id: "1",
      name: "Rohit Kumar",
      email: "rohit@gmail.com",
      date: "17/12/2025",
      message:
        "Transform your space with our expert interior design services. From modern makeovers to timeless elegance...",
    },
    {
      id: "2",
      name: "Amit Singh",
      email: "amit@gmail.com",
      date: "16/12/2025",
      message:
        "I want to redesign my living room. Please share your pricing details.",
    },
  ];

  function handleReply(id: string, reply: string) {
    console.log("Reply submitted:", { id, reply });

    // Later:
    // await fetch("/api/admin/messages/reply", {...})
  }

  return (
    <section className="min-h-screen px-4 sm:p-6 justify-items-start">
      <div className="w-full flex justify-between pb-2">
        <PageRouteHeader />
        <div className="flex gap-4">
          <SearchInput/>
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
        <h1 className="text-xl font-semibold text-black">
          Messages
        </h1>
        <p className="text-sm">People who contacted you via the website</p>
      </div>

      <div className="w-full flex flex-col gap-y-8">
        {messages.map((msg) => (
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
