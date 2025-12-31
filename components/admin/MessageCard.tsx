"use client";

import { useState } from "react";
import { FaReply, FaPaperPlane } from "react-icons/fa";
import { MdOutlineMail, MdOutlineDateRange, MdClose } from "react-icons/md";
import md5 from "md5";

/* =========================
   GRAVATAR HELPER
========================= */
function getGravatar(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}

/* =========================
   TYPES
========================= */
export interface Message {
  id: string;
  name: string;
  email: string;
  date: string;
  message: string;
}

interface Props {
  data: Message;
  onReplySubmit?: (id: string, reply: string) => void;
}

/* =========================
   COMPONENT
========================= */
export default function MessageCard({ data, onReplySubmit }: Props) {
  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  function handleSend() {
    if (!reply.trim()) return;
    onReplySubmit?.(data.id, reply);
    setReply("");
    setShowReply(false);
  }

  function handleCancel() {
    setReply("");
    setShowReply(false);
  }

  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-5 flex gap-4">
      
      {/* Avatar */}
      <img
        src={getGravatar(data.email)}
        alt={data.name}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
          <div>
            <h4 className="text-sm font-semibold text-black">
              {data.name}
            </h4>
            <div className="flex flex-wrap gap-3">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MdOutlineMail size={14} />
                {data.email}
              </p>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MdOutlineDateRange size={14} />
                {data.date}
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <p className="mt-3 text-sm text-black leading-relaxed">
          {data.message}
        </p>

        {/* Reply Button (hidden when reply box open) */}
        {!showReply && (
          <button
            onClick={() => setShowReply(true)}
            className="mt-3 inline-flex items-center gap-2 text-xs font-medium bg-bg-secondary px-2 py-1 rounded-md cursor-pointer"
          >
            <FaReply size={10} />
            Reply
          </button>
        )}

        {/* Reply Box */}
        {showReply && (
          <div className="mt-3 rounded-md p-3">
            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="w-full resize-none bg-white border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <div className="flex justify-end gap-2 mt-2">
              {/* Cancel */}
              <button
                onClick={handleCancel}
                title="Cancel reply"
                className="inline-flex items-center justify-center bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-300"
              >
                <MdClose size={16} />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
              >
                <FaPaperPlane size={14} />
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
