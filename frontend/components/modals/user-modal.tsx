"use client";

import type { UserType } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import WarningModal from "./warning-modal";
import EditUserModal from "./edit-user-modal";
import Modal from "../ui/modal";
import Btn from "../ui/btn";

interface UserModalProps {
  user: UserType;
  closeModal: () => void;
}

function UserModal({ user, closeModal }: UserModalProps) {
  const [deleting, setDeleting] = useState<boolean | null>(null);
  const [editing, setEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const res = await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setDeleting(null);
    if (res.ok) {
      closeModal();
      router.refresh();
    } else {
      setError("Failed to delete user. Please try again.");
    }
  }

  if (editing) {
    return <EditUserModal user={user} closeModal={closeModal} />;
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5 p-5">
        <h2 className="text-xl font-bold">
          {user.firstName + " " + user.lastName}
        </h2>
        <div className="flex flex-col gap-y-3 text-sm">
          <div>ID: {user.id}</div>
          <div>First name: {user.firstName}</div>
          {user.middleName && <div>Middle name: {user.middleName}</div>}
          <div>Last name: {user.lastName}</div>
          <div>Is admin: {user.isAdmin ? "True" : "False"}</div>
        </div>
        {error && (
          <div className="text-red-500 text-sm flex gap-x-3 items-center">
            <FaExclamationTriangle size={15} /> {error}
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text="Manage"
            onclick={() => setEditing(true)}
            styles="text-sm w-fit!"
            primary
          />
          <Btn
            text="Profile"
            link={`/profile/${user.id}`}
            styles="text-sm w-fit!"
          />
          <Btn
            text="Delete"
            onclick={() => setDeleting(false)}
            styles="text-sm w-fit!"
          />
        </div>
      </div>
      <AnimatePresence>
        {deleting !== null && (
          <WarningModal
            title="Delete user confirmation"
            description={`Are you sure you want to delete the user ${user.firstName} ${user.lastName}? This will permanently delete all their data and information on Iridium. This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(null)}
            loading={deleting}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default UserModal;
