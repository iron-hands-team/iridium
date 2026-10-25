"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import NewChannelModal from "../modals/new-channel";
import { getSession } from "@/lib/auth";

function ChannelBtn() {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <>
      <Btn text="New channel" onclick={() => setCreating(true)} />
      <AnimatePresence>
        {creating && (
          <NewChannelModal
            closeModal={() => setCreating(false)}
            toast={(m) => toast.success(m)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default ChannelBtn;
