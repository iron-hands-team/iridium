"use client";

import type { UserType } from "@/types/user";
import {
  FaSignOutAlt,
  FaUser,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaLightbulb,
  FaExclamationCircle,
} from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { profileUrl } from "@/lib/helpers";
import { tips } from "@/lib/constants";
import toast, { Renderable } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const optionStyles =
  "hover:bg-zinc-200 dark:hover:bg-zinc-900 flex items-center gap-x-2 p-2 group cursor-pointer text-sm";
const iconStyles =
  "group-hover:scale-110 group-hover:-translate-y-1 group-active:scale-90 group-active:translate-y-1 transition-transform!";

function NavUser({ user }: { user: UserType }) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [currentTip, setCurrentTip] = useState<number>(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      toast.success("Logout successful!");
      router.push("/");
      router.refresh();
    } else {
      toast.error("Logout failed, please try again");
    }
  }

  function handleTip() {
    let index = currentTip;
    while (tips.length > 1 && index === currentTip) {
      index = Math.floor(Math.random() * tips.length);
    }
    setCurrentTip(index);
    toast(tips[index].text, { icon: tips[index].icon as Renderable });
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex items-center gap-x-5" ref={menuRef}>
      <div className="relative">
        <div
          className="border border-zinc-800 hover:bg-zinc-200/85 dark:hover:bg-zinc-900/50 cursor-pointer flex items-center px-3 p-1 gap-x-3"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {user.image ? (
            <Image
              src={profileUrl(user.username)}
              alt="User avatar"
              width={35}
              height={35}
              className="w-7 h-7"
              unoptimized
              suppressHydrationWarning
            />
          ) : (
            <FaUserCircle size={30} />
          )}
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
              <Link href={`/profile/${user.username}`} className={optionStyles}>
                <FaUser size={18} className={iconStyles} />
                Profile
              </Link>
              <div
                className={optionStyles}
                onMouseDown={() =>
                  setTheme(theme !== "light" ? "light" : "dark")
                }
              >
                {theme !== "light" ? (
                  <FaSun size={20} className={iconStyles} />
                ) : (
                  <FaMoon size={20} className={iconStyles} />
                )}
                Theme
              </div>
              <div className={optionStyles} onClick={handleTip}>
                <FaLightbulb size={18} className={iconStyles} />
                Tip
              </div>
              <Link href="/report" className={optionStyles}>
                <FaExclamationCircle size={18} className={iconStyles} />
                Report
              </Link>
              <Link href="/settings" className={optionStyles}>
                <FaGear size={18} className={iconStyles} />
                Settings
              </Link>
              <div className={optionStyles} onClick={handleLogout}>
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
