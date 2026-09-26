"use client";

import type { PostType } from "@/lib/schemas";
import type { UserType } from "@/types/user";
import { FaArchive, FaHeart } from "react-icons/fa";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Menu from "../ui/menu";
import WarningModal from "../modals/warning";
import { TbPinnedFilled } from "react-icons/tb";
import PostAnnouncementModal from "../modals/post-announcement";

interface AnnouncementProps {
  announcement: PostType;
  user: UserType;
}

function Announcement({ announcement, user }: AnnouncementProps) {
  const [likes, setLikes] = useState<string[]>([]);
  const [editing, setEditing] = useState<boolean | null>(null);
  const [archiving, setArchiving] = useState<boolean | null>(null);
  const [deleting, setDeleting] = useState<boolean | null>(null);
  const router = useRouter();

  async function handleLike() {
    setLikes(
      likes.includes(user.username)
        ? likes.filter((l) => l !== user.username)
        : [...likes, user.username],
    );
    //TODO: add likes to announcements
  }

  async function handlePin() {
    //TODO: pin/unpin announcements
  }

  async function handleArchive() {
    //TODO: archive/unarchive announcements
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/announcements/${announcement.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    router.refresh();
    setDeleting(null);
  }

  return (
    <div className="border-1 border-zinc-800 p-4 flex flex-col gap-y-2 relative">
      <div>
        <div className="text-zinc-700 dark:text-zinc-300 text-xs">
          To {announcement.role || "all"}:
        </div>
        <div className="flex gap-x-5 items-center">
          <h2 className="text-lg font-bold flex gap-x-2 items-center">
            {announcement.archived && (
              <FaArchive size={25} title="Archived announcement" />
            )}
            {announcement.pinned && (
              <TbPinnedFilled size={25} title="Pinned announcement" />
            )}
            {announcement.title}
          </h2>
          {announcement.created_at && (
            <div
              className="text-xs text-black dark:text-zinc-300"
              title={announcement.created_at}
              suppressHydrationWarning
            >
              {new Date(announcement.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-black! dark:text-zinc-300!">
        {announcement.content}
      </p>
      <div>
        <div
          className="text-sm flex items-center gap-x-2 cursor-pointer text-zinc-700 dark:text-zinc-300 w-fit group"
          onClick={handleLike}
          title={`${likes.includes(user.username) ? "Unlike" : "Like"} this announcement`}
        >
          <div className="group-hover:-translate-y-0.5 group-hover:scale-115 transition-transform!">
            <FaHeart
              className={likes.includes(user.username) ? "text-red-500" : ""}
              size={13}
            />
          </div>
          {likes.length}
        </div>
      </div>
      {user.role === "admin" && (
        <>
          <Menu
            options={[
              {
                name: announcement.pinned ? "Unpin" : "Pin",
                onclick: handlePin,
              },
              { name: "Edit", onclick: () => setEditing(false) },
              {
                name: announcement.archived ? "Unarchive" : "Archive", //TODO: run celery/background service to automatically archive posts after a certain duration
                onclick: () => setArchiving(false),
                warning: !announcement.archived,
              },
              {
                name: "Delete",
                onclick: () => setDeleting(false),
                warning: true,
              },
            ]}
            styles="absolute right-4 top-4"
          />
          <AnimatePresence>
            {editing !== null && (
              <PostAnnouncementModal
                existing={announcement}
                closeModal={() => setEditing(null)}
              />
            )}
            {archiving !== null && (
              <WarningModal
                title="Archive post confirmation"
                description={`Are you sure you want to archive the announcement ${announcement.title}? This will hide it from the main dashboard and will only be visible to admins. This action can be undone.`}
                confirm={handleArchive}
                closeModal={() => setArchiving(null)}
                loading={archiving}
              />
            )}
            {deleting !== null && (
              <WarningModal
                title="Delete post confirmation"
                description={`Are you sure you want to delete the announcement ${announcement.title}? This will permanently delete all its data and information on Iridium. This action cannot be undone.`}
                confirm={handleDelete}
                closeModal={() => setDeleting(null)}
                loading={deleting}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

export default Announcement;
