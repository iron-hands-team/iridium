"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";

type OptionType = {
  name: string;
  onclick: () => void;
  warning?: boolean;
};

interface MenuProps {
  options: OptionType[];
  styles?: string;
}

function Menu({ options, styles }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div ref={menuRef} className={styles}>
      <div className="relative">
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 border border-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-900 cursor-pointer"
        >
          <FaEllipsisV size={15} />
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[calc(100%+10px)] right-0 w-30 bg-zinc-100 dark:bg-zinc-950 border border-zinc-800 p-2 z-10"
            >
              {options.map((option, i) => {
                return (
                  <div
                    key={i}
                    onClick={option.onclick}
                    className={`px-3 py-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-900 text-sm cursor-pointer ${option.warning && "text-red-500"}`}
                  >
                    {option.name}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Menu;
