"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import WarningModal from "../modals/warning";
import Btn from "../ui/btn";

function Delete({ username }: { username: string }) {
  const [deleting, setDeleting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setError(null);
    const res = await fetch(`/api/users/${username}/request-delete`, {
      method: "POST",
    });
    if (res.ok) {
      setDeleting(false); //TODO: add toast popup for backend operation status
    } else {
      setError("Something went wrong, please try again");
    }
  }

  return (
    <>
      <Btn
        text="Delete account"
        onclick={() => setDeleting(true)}
        styles="w-fit bg-red-500! text-white! border-red-500!"
        primary
      />
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Request account deletion"
            description={`Are you sure you want to request account deletion for ${username}? If approved, your data and information on Iridium will be deleted permanently. You cannot do this yourself due to security reasons, so an admin's approval is required.`}
            confirm={handleConfirm}
            closeModal={() => setDeleting(false)}
            error={error || undefined}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Delete;
