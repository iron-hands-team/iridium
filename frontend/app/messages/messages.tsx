"use client";

import type { MessageType } from "@/types/message";
import type { UserType } from "@/types/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence} from "framer-motion";
import { FaEnvelopeOpen, FaEnvelope, FaExclamationTriangle, FaTrash } from "react-icons/fa";
import { type NewMessageType, newMessageSchema } from "@/lib/schemas";
import MessageBtn from "@/components/chat/message-btn";
import Btn from "@/components/ui/btn";
import Modal from "@/components/ui/modal";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Dropdown from "@/components/ui/dropdown";
import { input } from "zod";
import WarningModal from "@/components/modals/warning";

const emptyMessage = { subject: "", body: "" };
const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs/60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes/60);
  if (hours<24) return `${hours}h ago`;
  const days = Math.floor(hours/24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

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
  const [deleting, setDeleting] = useState<Set<number>>(new Set()); //actual set of message ids the user checked so far
  const [selecting, setSelecting] = useState<boolean>(false); //is the checkbox ui on?
  const [confirming, setConfirming] = useState<boolean>(false); //is the confirm delete dialogue on hte screen?
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

  async function deleteMessage(id: number) {
    try {
      await fetch(`/api/messages/${id}`, {
      method: "DELETE",
      credentials: "include",
      });
    
      router.refresh();
    } catch(error) {
      console.error("Failed to delete message:", error)
    }
  }

  async function confirmBulkDelete() {
    for (const id of deleting) {
      await deleteMessage(id);
    }
    setConfirming(false);
    setSelecting(false);
    setDeleting(new Set());
  }

  function toggleSelected(id: number) {
    const myset = new Set(deleting);

    if (myset.has(id)) {
      myset.delete(id);
    } else {
      myset.add(id);
    }

    setDeleting(myset);
  }

  async function markAllRead() {
    await fetch("/api/messages/read-all", {
      method: "PATCH",
      credentials: "include",
    });
    router.refresh();
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
         {tab === "inbox" && unread > 0 && (
          <button
            className="px-2 text-xs text-zinc-500 hover:text-black dark:hover:text-zinc-300 self-center"
            onClick={markAllRead}
          >
            Mark all read
          </button>
        )}
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
                    {selecting && (
                      <input
                        type="checkbox"
                        checked={deleting.has(m.id)}
                        onChange={() => toggleSelected(m.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
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
                  <span className="text-xs text-zinc-500" title={new Date(m.createdAt).toLocaleString()}>
                    {timeAgo(m.createdAt)}
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
                  placeholder="Please Change My Grade to an A "
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
      <AnimatePresence>
        {confirming && (
            <WarningModal
              title="Delete message(s) confirmation"
              description={`Are you sure you want to delete the following message(s)? This will permanently delete all its data and information on Iridium. This action cannot be undone.`}
              confirm={confirmBulkDelete}
              closeModal={() => setSelecting(false)}
            />
          )}
      </AnimatePresence>
      <button
        className="fixed bottom-6 right-6 z-50 bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-red-600"
        onClick={() => {
          if (!selecting) {
            setSelecting(true);
          } else if (selecting === true && deleting.size > 0) {
            setConfirming(true);
          }
        }}
        <FaTrash/>
      </button>
    </div>
  );
}

export default Messages;