"use client";

import type { MessageType } from "@/types/chat";
import { useState, useEffect, useRef } from "react";
import Message from "./message";
import MessageInput from "./message-input";

interface MessagesProps {
  messages: MessageType[];
  id: string;
  userId: number;
}

function Messages({ messages, id, userId }: MessagesProps) {
  const [replying, setReplying] = useState<number | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-y-1 h-[calc(100vh-140px)] overflow-y-auto w-full pt-10 pb-5">
        {messages.map((message, i) => (
          <div key={message.id}>
            {(i === 0 ||
              messages[i - 1].createdAt.toLocaleDateString() !==
                message.createdAt.toLocaleDateString()) && (
              <div className="flex justify-center items-center py-5 text-sm text-zinc-700 dark:text-zinc-300 px-11 relative">
                <div className="bg-zinc-800 h-0.25 w-full" />
                <div
                  className="absolute bg-zinc-200 dark:bg-zinc-950 px-5"
                  suppressHydrationWarning
                >
                  {new Date().toLocaleDateString() ===
                  message.createdAt.toLocaleDateString()
                    ? "Today"
                    : message.createdAt.toLocaleDateString()}
                </div>
              </div>
            )}
            <Message
              message={message}
              setReplying={setReplying}
              header={
                i === 0 ||
                (message.replyingTo ? true : false) ||
                messages[i - 1].userId !== message.userId ||
                message.createdAt.getTime() -
                  messages[i - 1].createdAt.getTime() >
                  600000 ||
                messages[i - 1].createdAt.toLocaleDateString() !==
                  message.createdAt.toLocaleDateString()
              }
              owned={message.user.id === userId}
            />
          </div>
        ))}
        <div ref={messagesRef} />
      </div>
      <MessageInput
        id={Number(id)}
        replying={replying}
        setReplying={setReplying}
      />
    </div>
  );
}

export default Messages;
