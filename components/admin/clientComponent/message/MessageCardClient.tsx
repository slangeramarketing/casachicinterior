"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import MessageCard from "@/components/admin/MessageCard";
import FilterDropdown from "@/components/common/FilterDropdown";
import { PageRouteHeader, PageTitle } from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { replyMessageAction } from "@/app/(pwa)/admin/message/actions/reply-message.action";
import { RiFileExcel2Line } from "react-icons/ri";

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
  phone: string;
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

  function handleExportExcel() {
    if (!filteredItems.length) return;

    const rows = filteredItems.map((msg) => ({
      Name: msg.name,
      Phone: msg.phone,
      Email: msg.email || "",
      City: msg.city,
      Message: msg.message,
      "Created At": new Date(msg.createdAt).toLocaleString("en-IN"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Messages");

    XLSX.writeFile(
      workbook,
      `casachic-messages-${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  }


  return (
    <section className="min-h-screen px-4 py-6 sm:p-6">
      <div className="w-full flex md:flex-row flex-col md:gap-0 gap-4 justify-between pb-2">
        <PageRouteHeader />
        <div className="flex md:flex-row flex-col gap-4 items-center">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search messages..."
            className="md:w-auto w-full"
          />

          <div className=" md:w-auto w-full flex gap-4 items-center">
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

            <button
              onClick={handleExportExcel}
              disabled={!filteredItems.length}
              className="px-2 py-1.5 text-xs rounded-md border border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-50 flex gap-2 items-center"
            >
              <RiFileExcel2Line size={20} /> Export To Excel
            </button>
          </div>
        </div>

      </div>

      <div className="w-full pb-8 mt-4">
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



