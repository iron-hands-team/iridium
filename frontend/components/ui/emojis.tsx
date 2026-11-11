"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojisProps {
  children: React.ReactNode;
  setEmoji: (e: string) => void;
  above?: boolean;
  setOpen?: (v: boolean) => void;
}

function Emojis({ children, setEmoji, above, setOpen }: EmojisProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);

  function handleSelect(e: { native: string }) {
    setEmoji(e.native);
    setMenuOpen(false);
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!emojiRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
        if (setOpen) setOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [setOpen]);

  return (
    <div ref={emojiRef} className="relative flex justify-center z-100">
      <div onClick={() => setMenuOpen(!menuOpen)}>{children}</div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute z-100 ${above ? "bottom-[calc(100%+5px)]" : "top-[calc(100%+5px)]"} right-0`}
          >
            <Picker
              data={data}
              onEmojiSelect={handleSelect}
              previewPosition="none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Emojis;
