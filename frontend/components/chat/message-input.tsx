"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../ui/input";
import Btn from "../ui/btn";

function MessageInput({ id }: { id: number }) {
  const [message, setMessage] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
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
        router.refresh();
        setMessage("");
      } else {
        //TODO: add error message
      }
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSend}
      className="w-full border border-zinc-800 relative flex items-center"
    >
      <Input
        placeholder="Message channel"
        value={message}
        setValue={(m) => setMessage(m)}
        styles="bg-transparent! p-5! flex-1"
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
  );
}

export default MessageInput;
