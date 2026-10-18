"use client";

import type { MessageType, ReplyType } from "@/types/chat";
import type { ChannelType } from "@/lib/schemas";
import { useState, useEffect, useRef } from "react";
import { FaMessage } from "react-icons/fa6";
import { FaHashtag, FaUsers } from "react-icons/fa";
import Message from "./message";
import MessageInput from "./message-input";
import Link from "next/link";

interface MessagesProps {
  channel: ChannelType;
  messages: MessageType[];
  id: string;
  userId: number;
  admin: boolean;
}

function Messages({ channel, messages, id, userId, admin }: MessagesProps) {
  const [replying, setReplying] = useState<ReplyType | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (highlighted) {
      setTimeout(() => {
        setHighlighted(null);
      }, 2000);
    }
  }, [highlighted]);

  return (
    <div className="flex-1">
      <div className="border-b-1 border-zinc-800 flex items-center gap-x-7 px-4 py-2">
        <div className="font-bold flex items-center gap-x-3">
          <FaHashtag size={18} />
          {channel.name}
        </div>
        <div className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
          Channel description coming soon!
        </div>
        {/* TODO: channel description */}
        {channel.clubName && (
          <>
            <Link
              href={`/clubs/${channel.club}`}
              className="bg-zinc-300 dark:bg-zinc-900 px-2 py-1 text-xs"
              title="This is a club channel"
            >
              {channel.clubName}
            </Link>
            <div
              className="flex gap-x-1 items-center text-xs"
              title={`${channel.count} member${channel.count === 1 ? "" : "s"}`}
            >
              <FaUsers size={18} /> {channel.count}
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col gap-y-1 h-[calc(100vh-178px)] overflow-y-auto w-full py-10">
        {messages.length > 0 ? (
          messages.map((message, i) => (
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
                setHighlighted={setHighlighted}
                header={
                  i === 0 ||
                  (message.replyingTo ? true : false) ||
                  messages[i - 1].user.id !== message.user.id ||
                  message.createdAt.getTime() -
                    messages[i - 1].createdAt.getTime() >
                    600000 ||
                  messages[i - 1].createdAt.toLocaleDateString() !==
                    message.createdAt.toLocaleDateString()
                }
                owned={message.user.id === userId}
                highlighted={highlighted === message.id}
                admin={admin}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-y-5 text-zinc-700 dark:text-zinc-300 h-full justify-center items-center">
            <FaMessage size={50} />
            No messages in this channel yet. Start the conversation!
          </div>
        )}
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
