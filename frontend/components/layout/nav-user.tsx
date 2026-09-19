"use client";

import type { UserType } from "@/lib/auth";
import {
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";

const optionStyles =
  "hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-2 p-2 group cursor-pointer";
const iconStyles =
  "group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-90 group-active:translate-y-1 transition-transform!";

function NavUser({ user }: { user: UserType }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

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
    <div className="flex items-center gap-x-5 absolute right-50" ref={menuRef}>
      <div className="relative">
        <div
          className="border border-zinc-800 hover:bg-zinc-200/85 dark:hover:bg-zinc-900/50 cursor-pointer flex items-center px-3 py-1.5 gap-x-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FaUserCircle size={20} />
          {user.firstName}
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[calc(100%+15px)] right-0 border-1 border-zinc-800 w-35 bg-zinc-100 dark:bg-zinc-950 flex flex-col gap-y-1 p-2 origin-top"
            >
              <Link href="/profile" className={optionStyles}>
                <FaUser size={18} className={iconStyles} />
                Profile
              </Link>
              <div
                className={optionStyles}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <FaSun size={20} className={iconStyles} />
                ) : (
                  <FaMoon size={20} className={iconStyles} />
                )}
                Theme
              </div>
              <Link href="/settings" className={optionStyles}>
                <FaGear size={18} className={iconStyles} />
                Settings
              </Link>
              <div className={optionStyles}>
                <FaSignOutAlt size={18} className={iconStyles} />
                Log out
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default NavUser;
