"use client";

import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import Btn from "../ui/btn";
import PostAnnouncementModal from "../modals/post-announcement";

interface NewAnnouncementProps {
  text?: string;
  full?: boolean;
}

function NewAnnouncement({ text, full }: NewAnnouncementProps) {
  const [posting, setPosting] = useState<boolean>(false);

  return (
    <div>
      <Btn
        text={text || "New announcement"}
        onclick={() => setPosting(true)}
        styles={full ? "w-full!" : ""}
        primary
      />
      <AnimatePresence>
        {posting && (
          <PostAnnouncementModal
            closeModal={() => setPosting(false)}
            toast={(m) => toast.success(m)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default NewAnnouncement;
