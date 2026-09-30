"use client";

import type { ClubType } from "@/types/clubs";
import type { UserType } from "@/types/user";
import { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Modal from "../ui/modal";
import WarningModal from "./warning";
import Btn from "../ui/btn";
import NewClubModal from "./new-club";

interface ClubModalProps {
  club: ClubType;
  closeModal: () => void;
}

function ClubModal({ club, closeModal }: ClubModalProps) {
  const [deleting, setDeleting] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>();
  const [members, setMembers] = useState<{ id: number; user: UserType }[]>([]);
  const router = useRouter();
  const joined = members.find((m) => m.user.id === user?.id);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/clubs/${club.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleting(null);
    if (res.ok) {
      closeModal();
      router.refresh();
    } else {
      setError("Failed to delete club. Please try again.");
    }
  }

  async function handleSignUp() {
    if (joined) {
      router.push(`/clubs/${club.id}`);
    } else if (user?.role === "student") {
      await fetch(`/api/clubs/${club.id}/join`, {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
      closeModal();
    }
  }

  async function handleLeave() {
    if (user?.role === "student") {
      await fetch(`/api/clubs/${club.id}/leave`, {
        method: "DELETE",
        credentials: "include",
      });
      router.refresh();
      closeModal();
    }
  }

  async function handleFavorite() {
    console.log("favorite");
  }

  useEffect(() => {
    async function fetchData() {
      const user = await fetch("/api/me", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      setUser(user);
      const clubMembers = await fetch(`/api/clubs/${club.id}/members`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      setMembers(clubMembers);
    }
    fetchData();
  }, [club.id]);

  if (editing) {
    return (
      <NewClubModal existing={club} closeModal={() => setEditing(false)} />
    );
  }

  return (
    user && (
      <Modal closeModal={closeModal}>
        <div className="flex flex-col gap-y-5 p-5">
          <h2 className="text-xl font-bold flex items-center gap-x-3">
            {club.name}
            {joined && (
              <div
                className="bg-zinc-200 dark:bg-zinc-900 px-2 py-1 w-fit text-xs"
                title="You are part of this club"
              >
                Joined
              </div>
            )}
          </h2>
          <div className="flex flex-col gap-y-3 text-sm">
            {club.description && <div>{club.description}</div>}
            <div>Members: {members.length}</div>
            {club.sponsor && (
              <div>
                Sponsor: {`${club.sponsor.firstName} ${club.sponsor.lastName}`}
              </div>
            )}
            <div>Categories: {club.categories.join(", ")}</div>
          </div>
          {error && (
            <div className="text-red-500 text-sm flex gap-x-3 items-center">
              <FaExclamationTriangle size={15} /> {error}
            </div>
          )}
          <div className="flex gap-x-3">
            {user.role === "admin" && (
              <>
                <Btn
                  text="Edit"
                  onclick={() => setEditing(true)}
                  styles="text-sm"
                  primary
                />
                <Btn
                  text="Delete"
                  onclick={() => setDeleting(false)}
                  styles="text-sm"
                />
              </>
            )}
            {user.role === "student" && (
              <>
                <Btn
                  text={joined ? "Club page" : "Sign up"}
                  onclick={handleSignUp}
                  styles="text-sm"
                  primary
                />
                <Btn
                  text="Favorite"
                  onclick={handleFavorite}
                  styles="text-sm"
                />
                {joined && (
                  <Btn text="Leave" onclick={handleLeave} styles="text-sm" />
                )}
              </>
            )}
          </div>
        </div>
        <AnimatePresence>
          {deleting !== null && (
            <WarningModal
              title="Delete club confirmation"
              description={`Are you sure you want to delete the club ${club.name}? This will permanently delete all its data, signups, and other information on Iridium. This action cannot be undone.`}
              confirm={handleDelete}
              closeModal={() => setDeleting(null)}
              loading={deleting}
            />
          )}
        </AnimatePresence>
      </Modal>
    )
  );
}

export default ClubModal;
