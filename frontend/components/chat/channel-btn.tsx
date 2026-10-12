"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Btn from "../ui/btn";
import NewChannelModal from "../modals/new-channel";

function ChannelBtn() {
  const [creating, setCreating] = useState<boolean>(false);

  return (
    <>
      <Btn text="New channel" onclick={() => setCreating(true)} />
      <AnimatePresence>
        {creating && <NewChannelModal closeModal={() => setCreating(false)} />}
      </AnimatePresence>
    </>
  );
}

export default ChannelBtn;
