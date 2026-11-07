"use client";

import type { ReplyType } from "@/types/chat";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaReply } from "react-icons/fa";
import Input from "../ui/input";
import Btn from "../ui/btn";

interface MessageInputProps {
  id: number;
  replying: ReplyType | null;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
}

function MessageInput({ id, replying, setReplying }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [slow, setSlow] = useState<number | null>(null);
  const [sent, setSent] = useState<number | null>(null);
  const time = sent
    ? sent > 3600
      ? Math.floor(sent / 3600) + " more hours"
      : sent > 60
        ? Math.floor(sent / 60) + " more minutes"
        : sent + " more seconds"
    : "";
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSend(e: React.SubmitEvent) {
    e.preventDefault();
    if (message.trim().length > 0) {
      setSending(true);
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          channel_id: id,
          replying: replying ? replying.id : undefined,
        }),
      });
      if (res.ok) {
        const countdown = setInterval(() => {
          setSent((prev) => (prev ? (prev > 0 ? prev! - 1 : null) : slow! - 2));
        }, 1000);
        setError(null);
        router.refresh();
        setMessage("");
        setReplying(null);
        setTimeout(
          () => {
            clearInterval(countdown);
            setSent(null);
          },
          (slow as number) * 1000,
        );
      } else {
        const status = await res.json();
        if (status.detail.includes("seconds")) {
          setError(
            "Slow mode enabled, please wait until you can send a message again!",
          );
        } else if (status.detail.includes("censored")) {
          setError(
            "Your message was censored by the blocklist, try again with a different word.",
          );
        } else {
          setError("Something went wrong, please try again");
        }
      }
      setSending(false);
    }
  }

  useEffect(() => {
    if (replying) inputRef.current?.focus();
  }, [replying]);

  useEffect(() => {
    async function fetchSlow() {
      const res = await fetch("/api/slow").then((res) => res.json());
      if (res && res.seconds) setSlow(res.seconds);
    }
    fetchSlow();
  }, []);

  return (
    <div className="relative ml-5">
      <AnimatePresence>
        {slow && sent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-200 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 flex gap-x-2 items-center absolute bottom-full text-xs py-1"
            title={`${slow} seconds between messages`}
          >
            <FaClock size={13} title="Slow mode enabled" />
            Chat slow mode enabled: wait {time} before sending another message
          </motion.div>
        )}
      </AnimatePresence>
      {replying && (
        <div className="absolute bottom-full bg-zinc-300 dark:bg-zinc-900 px-3 py-2 flex items-center justify-between w-full border border-zinc-800 border-b-0">
          <div className="flex gap-x-3 items-center text-sm text-zinc-700 dark:text-zinc-300">
            <FaReply className="-scale-x-100" />
            Replying to: {replying.text}
          </div>
          <FaXmark
            size={25}
            title="Cancel reply"
            onClick={() => setReplying(null)}
            className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-950 p-1"
          />
        </div>
      )}
      <form
        onSubmit={handleSend}
        className="w-full border border-zinc-800 relative flex items-center"
      >
        <Input
          placeholder="Message channel"
          value={message}
          setValue={(m) => setMessage(m)}
          styles="bg-transparent! px-5! py-4! flex-1"
          ref={inputRef}
          full
        />
        {message.trim().length > 0 && (
          <Btn
            text={sending ? "Sending..." : "Send"}
            styles="absolute right-3"
            primary
          />
        )}
      </form>
      {(slow || error) && (
        <div className="absolute top-full pt-0.5 text-xs">
          {error && <div className="text-red-500">{error}</div>}
        </div>
      )}
    </div>
  );
}

export default MessageInput;
