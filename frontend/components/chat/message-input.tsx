"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaXmark } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import Input from "../ui/input";
import Btn from "../ui/btn";

interface MessageInputProps {
  id: number;
  replying: number | null;
  setReplying: React.Dispatch<React.SetStateAction<number | null>>;
}

function MessageInput({ id, replying, setReplying }: MessageInputProps) {
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
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
        body: JSON.stringify({ message, channel_id: id }),
      });
      if (res.ok) {
        setError(null);
        router.refresh();
        setMessage("");
      } else {
        setError("Something went wrong, please try again");
      }
      setSending(false);
    }
  }

  return (
    <div className="relative pl-5">
      {replying && (
        <div className="absolute bottom-full bg-zinc-300 dark:bg-zinc-900 px-3 py-2 flex items-center justify-between w-full border border-zinc-800 border-b-0">
          <div className="flex gap-x-3 items-center text-sm text-zinc-700 dark:text-zinc-300">
            <FaReply className="-scale-x-100" />
            Replying to: {replying}
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
      {error && (
        <div className="text-red-500 text-xs absolute top-full pt-0.5">
          {error}
        </div>
      )}
    </div>
  );
}

export default MessageInput;
