"use client";

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
    <div ref={menuRef} className="relative text-sm">
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className="cursor-pointer border border-zinc-800 hover:bg-zinc-200/85 dark:hover:bg-zinc-900/50 px-3 py-1.5"
      >
        {value}
      </div>
      {menuOpen && (
        <div className="absolute top-[calc(100%+15px)] left-[50%] translate-x-[-50%] w-30 bg-zinc-100 dark:bg-zinc-950 border border-zinc-800 p-2">
          {label && (
            <div className="text-center pb-2 text-zinc-700 dark:text-zinc-300">
              {label}
            </div>
          )}
          {values.map((value) => {
            return (
              <div
                key={value}
                onClick={() => handleSelect(value)}
                className="hover:bg-zinc-200 dark:hover:bg-zinc-900 px-3 py-1 cursor-pointer"
              >
                {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
