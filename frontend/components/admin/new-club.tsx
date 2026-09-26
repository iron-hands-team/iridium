"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Btn from "../ui/btn";
import NewClubModal from "../modals/new-club";

function NewClub({ full }: { full?: boolean }) {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <div>
      <Btn
        text="New club"
        onclick={() => setCreating(true)}
        styles={full ? "w-full!" : ""}
        primary
      />
      <AnimatePresence>
        {creating && <NewClubModal closeModal={() => setCreating(false)} />}
      </AnimatePresence>
    </div>
  );
}

export default NewClub;
