"use client";

import { useState } from "react";
import PostAnnouncementModal from "../modals/post-announcement";
import Btn from "../ui/btn";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

function AnnouncementBar() {
  const [posting, setPosting] = useState<boolean>(false);
  const router = useRouter();

  return (
    <div className="flex gap-x-3">
      <Btn text="New post" onclick={() => setPosting(true)} primary />
      <Btn text="Manage posts" link="/admin/announcements" />
      <AnimatePresence>
        {posting && (
          <PostAnnouncementModal
            closeModal={() => setPosting(false)}
            refresh={() => router.refresh()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AnnouncementBar;
