"use client";

import type { ChannelType } from "@/app/chat/page";
import { FaEllipsisV } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NewChannelModal from "../modals/new-channel";
import WarningModal from "../modals/warning";

const optionStyles =
  "px-3 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-900 text-sm cursor-pointer";

function ChannelMenu({ channel }: { channel: ChannelType }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  async function handleDelete() {
    setError(null);
    const res = await fetch(`/api/chat/channel/${channel.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Channel deleted successfully!");
      setDeleting(false);
      setMenuOpen(false);
      router.refresh();
      router.push("/chat");
    } else {
      setError("Something went wrong, please try again");
    }
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className="absolute right-4 opacity-0 group-hover:opacity-100 transition-all! font-normal"
    >
      <div className="relative">
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 border border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <FaEllipsisV size={15} />
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[calc(100%+2px)] right-0 w-30 bg-zinc-100 dark:bg-zinc-950 border border-zinc-800 p-2 z-10 cursor-default"
            >
              <div className={optionStyles} onClick={() => setEditing(true)}>
                Edit
              </div>
              <div
                className={optionStyles + " text-red-500"}
                onClick={() => setDeleting(true)}
              >
                Delete
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {editing && (
            <NewChannelModal
              existing={channel}
              closeModal={() => setEditing(false)}
              toast={(m) => toast.success(m)}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {deleting && (
            <WarningModal
              confirm={handleDelete}
              closeModal={() => setDeleting(false)}
              title="Delete channel confirmation"
              description="Are you sure you want to delete this channel? All its messages and data will be deleted. This action is irreversible."
              error={error || undefined}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ChannelMenu;
