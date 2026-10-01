"use client";

import type { UserType } from "@/types/user";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewUserModal from "../modals/new-user";
import Btn from "../ui/btn";

function Edit({ user }: { user: UserType }) {
  const [editing, setEditing] = useState<boolean>(false);

  return (
    <>
      <Btn
        text="Edit"
        onclick={() => setEditing(true)}
        styles="w-fit"
        primary
      />
      <AnimatePresence>
        {editing && (
          <NewUserModal closeModal={() => setEditing(false)} existing={user} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Edit;
