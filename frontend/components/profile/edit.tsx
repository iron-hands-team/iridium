"use client";

import type { UserType } from "@/types/user";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import NewUserModal from "../modals/new-user";
import toast from "react-hot-toast";
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
          <NewUserModal
            closeModal={() => setEditing(false)}
            toast={(m) => toast.success(m)}
            existing={user}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default Edit;
