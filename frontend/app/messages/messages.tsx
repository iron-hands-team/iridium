"use client";

import type { MessageType } from "@/types/message";
import type { UserType } from "@/types/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FaEnvelopeOpen, FaEnvelope, FaExclamationTriangle } from "react-icons/fa";
import { type NewMessageType, newMessageSchema } from "@/lib/schemas";
import MessageBtn from "@/components/chat/message-btn";
import Btn from "@/components/ui/btn";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Dropdown from "@/components/ui/dropdown";

const emptyMessage = { subject: "", body: "" };
const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";

function timeAgo

function Messages({
  inbox,
  sent,
  recipients,
}: {
  inbox: MessageType[];
  sent: MessageType[];
  recipients: UserType[];
}) {
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [composing, setComposing] = useState<boolean>(false);
  const [recipientLabel, setRecipientLabel] = useState<string>("");
  const [message, setMessage] = useState<NewMessageType>(emptyMessage);
  const [sending, setSending] = useState<boolean>(false);
  const [composeError, setComposeError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const messages = (tab === "inbox" ? inbox : sent).filter((m) => {
    const other = tab === "inbox" ? m.sender : m.recipient;
    return [m.subject, other.firstName, other.lastName, other.username]
      .join(" ")
      .toLowerCase()
      .includes(search.trim().toLowerCase());
  });

  const unread = inbox.filter((m) => !m.read).length;

  const recipientLabels = recipients.map(
    (r) => `${r.firstName} ${r.lastName} (@${r.username})`,
  );

  function closeCompose() {
    setComposing(false);
    setRecipientLabel("");
    setMessage(emptyMessage);
    setComposeError(null);
  }

  async function handleComposeSend() {
    setSending(true);
    setComposeError(null);
    const recipient = recipients.find(
      (r) => `${r.firstName} ${r.lastName} (@${r.username})` === recipientLabel,
    );
    if (!recipient) {
      setComposeError("Please select a recipient.");
      setSending(false);
      return;
    }
    const validated = newMessageSchema.safeParse(message);
    if (!validated.success) {
      setComposeError(validated.error.issues[0].message);
      setSending(false);
      return;
    }
    const res = await fetch("/api/messages", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient_username: recipient.username,
        subject: validated.data.subject,
        body: validated.data.body,
      }),
    });
    if (res.ok) {
      closeCompose();
      router.refresh();
    } else {
      const body = await res.json().catch(() => null);
      setComposeError(body?.detail || "Something went wrong. Please try again.");
    }
    setSending(false);
  }

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
      <div className="flex justify-between items-center gap-x-3 border-b border-zinc-800">
      <div className="flex gap-x-3">
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
        <Btn text="New Message" styles="text-sm" onclick={() => setComposing(true)} primary />
      </div>
      <Input
        placeholder={`Search ${tab}`}
        value={search}
        setValue={(s) => setSearch(s)}
        clear
      />
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
      <AnimatePresence>
        {composing && (
          <Modal closeModal={closeCompose}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold">New message</h2>
              <label className={labelStyles}>
                <div>
                  To <span className="text-red-500">*</span>
                </div>
                <Dropdown
                  value={recipientLabel}
                  setValue={(v) => setRecipientLabel(v)}
                  values={recipientLabels}
                  label="Select a recipient"
                />
              </label>
              <label className={labelStyles}>
                <div>
                  Subject <span className="text-red-500">*</span>
                </div>
                <Input
                  placeholder="Change My Grade to an A Now"
                  value={message.subject}
                  setValue={(subject) => setMessage({ ...message, subject })}
                />
              </label>
              <label className={labelStyles}>
                <div>
                  Body <span className="text-red-500">*</span>
                </div>
                <Textarea
                  placeholder="It appears that you accidentally changed my grade to an F..."
                  value={message.body}
                  setValue={(body) => setMessage({ ...message, body })}
                />
              </label>
              {composeError && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {composeError}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={sending ? "Sending" : "Send"}
                  onclick={handleComposeSend}
                  styles="text-sm"
                  primary
                />
                <Btn text="Cancel" onclick={closeCompose} styles="text-sm" />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Messages;