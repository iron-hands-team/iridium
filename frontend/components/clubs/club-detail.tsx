"use client";

import type { ClubType, ClubMemberType } from "@/types/clubs";
import type { UserType } from "@/types/user";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaUsers, FaChalkboardTeacher, FaComments } from "react-icons/fa";
import toast from "react-hot-toast";
import Link from "next/link";
import Btn from "@/components/ui/btn";
import { profileUrl } from "@/lib/helpers";
import Image from "next/image";

interface ClubDetailProps {
  club: ClubType;
  members: ClubMemberType[];
  currentUser: UserType;
  channelId?: number;
}

function ClubDetail({ club, members, currentUser, channelId }: ClubDetailProps) {
  const [favorited, setFavorited] = useState<boolean>(
    club.favorites.includes(currentUser.username),
  );
  const router = useRouter();
  const joined = members.some((m) => m.user.id === currentUser.id);

  async function handleJoin() {
    const res = await fetch(`/api/clubs/${club.id}/join`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Club joined successfully!");
      router.refresh();
    } else {
      toast.error("Something went wrong, please try again");
    }
  }

  async function handleLeave() {
    const res = await fetch(`/api/clubs/${club.id}/leave`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Club left successfully!");
      router.refresh();
    } else {
      toast.error("Something went wrong, please try again");
    }
  }

  async function handleFavorite() {
    const method = favorited ? "DELETE" : "POST";
    const res = await fetch(`/api/clubs/${club.id}/favorite`, {
      method,
      credentials: "include",
    });
    if (res.ok) {
      setFavorited(!favorited);
    } else {
      toast.error("Something went wrong, please try again");
    }
  }

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex justify-between items-start gap-x-5">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-x-3">
            <FaUsers size={18} /> {club.name}
          </h2>
          {club.categories.length > 0 && (
            <div className="text-sm text-zinc-500 mt-1">
              {club.categories.join(", ")}
            </div>
          )}
        </div>
        {currentUser.role === "student" && (
          <div className="flex gap-x-3 shrink-0">
            {joined ? (
              <Btn text="Leave" onclick={handleLeave} styles="text-sm" />
            ) : (
              <Btn text="Join" onclick={handleJoin} styles="text-sm" primary />
            )}
            <Btn
              text={favorited ? "Unfavorite" : "Favorite"}
              onclick={handleFavorite}
              styles="text-sm"
            />
          </div>
        )}
      </div>

      {club.description && (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
          {club.description}
        </p>
      )}

      {club.sponsor && (
        <div className="text-sm flex items-center gap-x-2">
          <FaChalkboardTeacher size={15} />
          Sponsor: {club.sponsor.firstName} {club.sponsor.lastName}
        </div>
      )}

      {channelId !== undefined && (
        <Link
          href={`/chat/${channelId}`}
          className="text-sm flex items-center gap-x-2 hover:underline w-fit"
        >
          <FaComments size={15} /> Go to club chat
        </Link>
      )}

      <h3 className="font-bold text-sm mt-3">Members ({members.length})</h3>
      {members.length > 0 ? (
        <div className="flex flex-col gap-y-2">
          {members.map((m) => (
            <Link
              key={m.id}
              href={`/profile/${m.user.username}`}
              className="flex items-center gap-x-3 text-sm hover:underline w-fit"
            >
              {m.user.image ? (
                <Image
                  src={profileUrl(m.user.username)}
                  alt="Member avatar"
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full"
                  unoptimized
                />
              ) : null}
              {m.user.firstName} {m.user.lastName}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-sm text-zinc-500">No members yet.</div>
      )}
    </div>
  );
}

export default ClubDetail;