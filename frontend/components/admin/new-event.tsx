"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import NewEventModal from "../modals/new-event";

function NewEvent({ full }: { full?: boolean }) {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <div>
      <Btn
        text="New event"
        onclick={() => setCreating(true)}
        styles={full ? "w-full!" : ""}
        primary
      />
      <AnimatePresence>
        {creating && (
          <NewEventModal
            closeModal={() => setCreating(false)}
            toast={(m) => toast.success(m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewEvent;
