"use client";

import type { MessageType, ReplyType } from "@/types/chat";
import { FaPen, FaReply, FaTrash, FaUserCircle } from "react-icons/fa";
import { profileUrl, getTime } from "@/lib/helpers";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Input from "../ui/input";
import { GoReply } from "react-icons/go";

const optionStyles =
  "cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-900 p-1";

interface MessageProps {
  message: MessageType;
  setReplying: React.Dispatch<React.SetStateAction<ReplyType | null>>;
  setHighlighted: React.Dispatch<React.SetStateAction<number | null>>;
  header: boolean;
  owned: boolean;
  highlighted: boolean;
  admin?: boolean;
}

function Message({
  message,
  setReplying,
  setHighlighted,
  header,
  owned,
  highlighted,
  admin,
}: MessageProps) {
  const [label, setLabel] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleEdit(e?: React.SubmitEvent) {
    e?.preventDefault();
    if (
      editing &&
      editing.trim().length > 0 &&
      editing.trim() !== message.text
    ) {
      await fetch(`/api/chat/message/${message.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: editing.trim() }),
      });
      router.refresh();
    }
    setEditing(null);
  }

  async function handleDelete() {
    await fetch(`/api/chat/message/${message.id}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  useEffect(() => {
    setLabel(getTime(message.createdAt));
  }, [message]);

  useEffect(() => {
    if (highlighted)
      messageRef.current!.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [highlighted]);

  return (
    <div
      className={`w-full hover:bg-zinc-300/50 dark:hover:bg-zinc-900/50 flex flex-col px-11 py-2.5 gap-y-2 group relative justify-center ${highlighted && "bg-zinc-300! dark:bg-zinc-900!"}`}
      ref={messageRef}
    >
      {message.replyingTo && (
        <div
          className={`flex items-center gap-x-3 pl-2.5 w-fit text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer ${message.replyingTo.deleted && "italic"}`}
          onClick={() => setHighlighted(message.replyingTo!.id)}
        >
          <GoReply className="-scale-x-100" size={18} />
          <div className="flex items-center gap-x-1">
            {message.user.image ? (
              <Image
                src={profileUrl(message.user.username)}
                alt="Avatar"
                width={15}
                height={15}
              />
            ) : (
              <FaUserCircle size={15} />
            )}
            {message.user.firstName + " " + message.user.lastName}
          </div>
          {message.replyingTo.text}
        </div>
      )}
      {header && (
        <div className="flex items-center gap-x-7 text-sm text-zinc-700 dark:text-zinc-300 w-fit">
          <Link
            href={`/profile/${message.user.username}`}
            className="flex items-center gap-x-3"
            title={message.user.username}
          >
            {message.user.image ? (
              <Image
                src={profileUrl(message.user.username)}
                alt="Avatar"
                width={25}
                height={25}
              />
            ) : (
              <FaUserCircle size={25} />
            )}
            {message.user.firstName + " " + message.user.lastName}
          </Link>
          <div title={message.createdAt.toISOString()} className="text-xs">
            {label}
          </div>
        </div>
      )}
      {!header && (
        <div
          title={message.createdAt.toISOString()}
          className="text-xs absolute left-1.5 opacity-0 group-hover:opacity-100 transition-opacity! text-zinc-600 dark:text-zinc-400"
        >
          {label.slice(0, 5)}
        </div>
      )}
      {editing !== null ? (
        <form onSubmit={handleEdit}>
          <Input
            placeholder="Input edited message here"
            value={editing}
            setValue={(e) => setEditing(e)}
            onblur={() => handleEdit()}
            ref={inputRef}
          />
        </form>
      ) : (
        <p className="text-black! dark:text-white!">
          {message.text}{" "}
          {message.edited && (
            <span className="text-zinc-600 dark:text-zinc-400 text-xs pl-1">
              (edited)
            </span>
          )}
        </p>
      )}
      {editing === null && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity! absolute right-4 top-0 -translate-y-[50%] border border-zinc-800 bg-zinc-200 dark:bg-zinc-950 p-1 flex gap-x-2 text-zinc-700 dark:text-zinc-300">
          <FaReply
            size={23}
            className={optionStyles}
            title="Reply to message"
            onClick={() => setReplying({ id: message.id, text: message.text })}
          />
          {owned && (
            <FaPen
              size={23}
              className={optionStyles}
              title="Edit message"
              onClick={() => {
                setEditing(message.text);
                setTimeout(() => {
                  inputRef.current?.focus();
                }, 50);
              }}
            />
          )}
          {(admin || owned) && (
            <FaTrash
              size={23}
              className={optionStyles + " text-red-500"}
              title="Delete message"
              onClick={handleDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Message;
