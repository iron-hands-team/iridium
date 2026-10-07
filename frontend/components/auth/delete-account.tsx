"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import WarningModal from "../modals/warning";
import Btn from "../ui/btn";

function DeleteAccount({ username }: { username: string }) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete() {
    setError(null);
    const res = await fetch(`/api/users/${username}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
      setDeleting(false);
    } else {
      setError("Something went wrong, please try again");
    }
  }

  async function handleClear() {
    setError(null);
    const res = await fetch(`/api/users/${username}/clear`, {
      method: "PATCH",
    });
    if (res.ok) {
      router.refresh();
      setDeleting(false);
    } else {
      setError("Something went wrong, please try again");
    }
  }

  return (
    <div className="cursor-default">
      <FaTrash
        className="text-red-500 cursor-pointer"
        title="This user is requesting account deletion"
        onClick={() => setDeleting(true)}
      />
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Delete user confirmation"
            description={`Are you sure you want to delete this account (username ${username})? This will wipe all their data and information on Iridium. This action is permanent and irreversible.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            error={error || undefined}
          >
            <Btn text="Clear request" onclick={handleClear} />
          </WarningModal>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DeleteAccount;
