"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  value: string;
  setValue: (v: string) => void;
  values: string[];
  label?: string;
}

function Dropdown({ value, setValue, values, label }: DropdownProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function handleSelect(v: string) {
    setValue(v);
    setMenuOpen(false);
  }

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
    <div ref={menuRef} className="w-fit z-10 relative text-sm">
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="cursor-pointer border border-zinc-800 hover:bg-zinc-200/85 dark:hover:bg-zinc-900/50 px-3 py-1.5"
      >
        {value || "Select one"}
      </div>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[calc(100%+10px)] left-0 w-30 bg-zinc-100 dark:bg-zinc-950 border border-zinc-800 p-2"
          >
            {label && (
              <div className="text-center pb-2 text-zinc-700 dark:text-zinc-300">
                {label}
              </div>
            )}
            {values.map((v) => {
              return (
                <div
                  key={v}
                  onClick={() => handleSelect(v)}
                  className={`hover:bg-zinc-200 dark:hover:bg-zinc-900 px-3 py-1 cursor-pointer ${value === v && "font-bold"}`}
                >
                  {v}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
