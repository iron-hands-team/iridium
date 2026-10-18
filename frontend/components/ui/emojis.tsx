"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface EmojisProps {
  children: React.ReactNode;
  setEmoji: (e: string) => void;
  above?: boolean;
}

function Emojis({ children, setEmoji, above }: EmojisProps) {
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
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div ref={emojiRef} className="relative flex justify-center">
      <div onClick={() => setMenuOpen(!menuOpen)}>{children}</div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute z-100 ${above ? "bottom-[calc(100%+5px)]" : "top-[calc(100%+5px)]"}`}
          >
            <Picker data={data} onEmojiSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Emojis;
