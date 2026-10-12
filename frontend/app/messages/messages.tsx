"use client";

import type { MessageType } from "@/types/message";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import MessageBtn from "@/components/chat/message-btn";
import Btn from "@/components/ui/btn";

function Messages({
  inbox,
  sent,
}: {
  inbox: MessageType[];
  sent: MessageType[];
}) {
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [expanded, setExpanded] = useState<number | null>(null);
  const router = useRouter();

  const messages = tab === "inbox" ? inbox : sent;
  const unread = inbox.filter((m) => !m.read).length;

  async function openMessage(m: MessageType) {
    const opening = expanded !== m.id;
    setExpanded(opening ? m.id : null);
    if (tab === "inbox" && opening && !m.read) {
      await fetch(`/api/messages/${m.id}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      router.refresh();
    }
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex gap-x-3 border-b border-zinc-800">
        <button
          className={`px-4 py-2 font-bold flex items-center gap-x-2 ${
            tab === "inbox"
              ? "border-b-2 border-zinc-950 dark:border-zinc-300"
              : "text-zinc-500"
          }`}
          onClick={() => setTab("inbox")}
        >
          Inbox
          {unread > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
              {unread}
            </span>
          )}
        </button>
        <button
          className={`px-4 py-2 font-bold ${
            tab === "sent"
              ? "border-b-2 border-zinc-950 dark:border-zinc-300"
              : "text-zinc-500"
          }`}
          onClick={() => setTab("sent")}
        >
          Sent
        </button>
      </div>
      {messages.length === 0 ? (
        <div className="py-10 text-center text-sm text-zinc-500">
          No messages {tab === "inbox" ? "received" : "sent"} yet.
        </div>
      ) : (
        <div className="flex flex-col gap-y-2">
          {messages.map((m) => {
            const other = tab === "inbox" ? m.sender : m.recipient;
            const unreadInbox = tab === "inbox" && !m.read;
            return (
              <div
                key={m.id}
                className="border border-zinc-800 rounded-lg p-4 flex flex-col gap-y-2 cursor-pointer"
                onClick={() => openMessage(m)}
              >
                <div className="flex justify-between items-center gap-x-3">
                  <div className="flex items-center gap-x-2">
                    {tab === "inbox" &&
                      (m.read ? (
                        <FaEnvelopeOpen size={14} className="text-zinc-500" />
                      ) : (
                        <FaEnvelope size={14} className="text-blue-500" />
                      ))}
                    <span className={unreadInbox ? "font-bold" : ""}>
                      {tab === "inbox" ? "From" : "To"}: {other.firstName}{" "}
                      {other.lastName} (@{other.username})
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className={unreadInbox ? "text-sm font-bold" : "text-sm"}>
                  {m.subject}
                </p>
                {expanded === m.id && (
                  <div className="flex flex-col gap-y-3 pt-2 border-t border-zinc-800">
                    <p className="text-sm whitespace-pre-wrap">{m.body}</p>
                    {tab === "inbox" && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <MessageBtn
                          username={other.username}
                          onSent={() => router.refresh()}
                        >
                          <Btn text="Reply" styles="text-sm" />
                        </MessageBtn>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Messages;