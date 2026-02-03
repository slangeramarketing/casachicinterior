"use client";

import { useState } from "react";
import { FaReply, FaPaperPlane } from "react-icons/fa";
import {
  MdOutlineMail,
  MdOutlineDateRange,
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import md5 from "md5";

import Alert from "@/components/common/Alert";
import { formatDateTime } from "@/lib/utils/formatDateTime";
import { IoIosCall } from "react-icons/io";
import Link from "next/link";

/* =========================
   HELPERS
========================= */
function getGravatar(email: string): string {
  const hash = md5(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}

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
  city: string;
  replies: MessageReply[];
}

interface Props {
  data: MessageThread;
  onReplySubmit?: (id: string, reply: string) => Promise<void>;
}

/* =========================
   COMPONENT
========================= */
export default function MessageThreadCard({
  data,
  onReplySubmit,
}: Props) {
  const [showReply, setShowReply] = useState(false);
  const [showThread, setShowThread] = useState(false);
  const [reply, setReply] = useState("");

  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    title: string;
    message?: string;
  } | null>(null);

  const hasReplies = data.replies.length > 0;

  /* =========================
     HANDLERS
  ========================= */
  async function handleSend() {
    if (!reply.trim() || !onReplySubmit) return;

    try {
      setLoading(true);

      await onReplySubmit(data.id, reply);

      setReply("");
      setShowReply(false);
      setShowThread(true);

      setAlert({
        type: "success",
        title: "Reply sent",
        message: "Your reply has been delivered successfully.",
      });
    } catch (err) {
      console.error(err);

      setAlert({
        type: "error",
        title: "Reply failed",
        message: "Unable to send reply. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full bg-white rounded-lg p-4 sm:p-5 flex gap-4">
      {/* Avatar */}
      <img
        src={getGravatar(data.email)}
        alt={data.name}
        className="w-10 h-10 rounded-full"
      />

      <div className="flex-1">
        {/* Alert */}
        {alert && (
          <div className="mb-3">
            <Alert
              type={alert.type}
              title={alert.title}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-semibold text-black">
              {data.name}
            </h4>

            <div className="flex flex-wrap gap-3">
              <Link href={`tel:+91 ${data.phone}`}>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                <IoIosCall size={14} />
                {data.phone}
              </p>
              </Link>
              <Link href={`mailto:${data.email}`}>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                <MdOutlineMail size={14} />
                {data.email}
              </p>
              </Link>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <MdOutlineDateRange size={14} />
                {formatDateTime(data.createdAt)}
              </span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <CiLocationOn size={14} />
                {data.city}
              </span>
            </div>
          </div>

          {/* Thread toggle */}
          {hasReplies && (
            <button
              onClick={() => setShowThread((v) => !v)}
              className="text-gray-500 hover:text-gray-700"
              title={showThread ? "Hide replies" : "Show replies"}
            >
              {showThread ? (
                <MdKeyboardArrowUp size={22} />
              ) : (
                <MdKeyboardArrowDown size={22} />
              )}
            </button>
          )}
        </div>

        {/* Root Message */}
        <p className="mt-3 text-sm text-black leading-relaxed">
          {data.message}
        </p>

        {/* Replies */}
        {showThread && (
          <div className="mt-4 space-y-3">
            {data.replies.map((replyItem, index) => (
              <div
                key={index}
                className={`ml-6 border-l-2 pl-3 ${
                  replyItem.sender === "admin"
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-300 bg-gray-50"
                } rounded-md p-2`}
              >
                <p className="text-xs font-semibold text-gray-700">
                  {replyItem.sender === "admin"
                    ? "Admin Reply"
                    : data.name}
                </p>
                <p className="text-sm text-gray-800 mt-1">
                  {replyItem.message}
                </p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatDateTime(replyItem.repliedAt)}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Reply Button */}
        {!showReply && (
          <button
            onClick={() => setShowReply(true)}
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium bg-bg-secondary px-2 py-1 rounded-md"
          >
            <FaReply size={10} />
            Reply
          </button>
        )}

        {/* Reply Box */}
        {showReply && (
          <div className="mt-3 rounded-md p-3 bg-gray-50">
            <textarea
              rows={3}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Write your reply..."
              className="w-full resize-none bg-white border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setShowReply(false)}
                className="bg-gray-200 text-gray-600 px-3 py-1.5 rounded-md"
              >
                <MdClose size={16} />
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-md text-sm
                  ${
                    loading
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[#F97316] text-white"
                  }
                `}
              >
                <FaPaperPlane size={14} />
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
