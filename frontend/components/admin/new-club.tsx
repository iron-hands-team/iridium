"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import NewClubModal from "../modals/new-club";

interface NewClubProps {
  full?: boolean;
  primary?: boolean;
}

function NewClub({ full, primary }: NewClubProps) {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <div>
      <Btn
        text="New club"
        onclick={() => setCreating(true)}
        styles={full ? "w-full!" : ""}
        primary={!primary}
      />
      <AnimatePresence>
        {creating && (
          <NewClubModal
            closeModal={() => setCreating(false)}
            toast={(m) => toast.success(m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewClub;
