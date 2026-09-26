"use client";

import type { ClubType } from "@/types/clubs";
import { useState } from "react";
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
  const router = useRouter();

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

  if (editing) {
    return (
      <NewClubModal existing={club} closeModal={() => setEditing(false)} />
    );
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">{club.name}</h2>
        <div className="flex flex-col gap-y-3 text-sm">
          <div>{club.description}</div>
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
  );
}

export default ClubModal;
