"use client";

import { MdMail } from "react-icons/md";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { type NewMessageType, newMessageSchema } from "@/lib/schemas";
import Modal from "../ui/modal";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Btn from "../ui/btn";
import { FaExclamationTriangle } from "react-icons/fa";

const labelStyles =
  "text-black dark:text-zinc-300 text-sm flex flex-col gap-y-1 w-full";
const emptyMessage = {
  subject: "",
  body: "",
};

interface MessageBtnProps {
  username: string;
  children?: React.ReactNode;
}

function MessageBtn({ username, children }: MessageBtnProps) {
  const [messaging, setMessaging] = useState<boolean>(false);
  const [message, setMessage] = useState<NewMessageType>(emptyMessage);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    setLoading(true);
    setError(null);
    const validated = newMessageSchema.safeParse(message);
    if (validated.success) {
      //TODO: send message
      setMessage(emptyMessage);
      setMessaging(false);
    } else {
      setError(validated.error.issues[0].message);
    }
    setLoading(false);
  }

  return (
    <>
      {children || (
        <MdMail
          size={18}
          title="Message user"
          onClick={() => setMessaging(true)}
        />
      )}
      <AnimatePresence>
        {messaging && (
          <Modal closeModal={() => setMessaging(false)}>
            <div className="flex flex-col gap-y-5 p-5">
              <h2 className="text-xl font-bold flex items-center gap-x-3">
                Message {username}
              </h2>
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
              {error && (
                <div className="text-red-500 text-sm flex gap-x-3 items-center">
                  <FaExclamationTriangle size={15} /> {error}
                </div>
              )}
              <div className="flex gap-x-3">
                <Btn
                  text={loading ? "Sending" : "Send"}
                  onclick={handleSend}
                  styles="text-sm"
                  primary
                />
                <Btn
                  text="Cancel"
                  onclick={() => setMessaging(false)}
                  styles="text-sm"
                />
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default MessageBtn;
