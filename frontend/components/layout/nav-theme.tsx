"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function NavTheme() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div
        className="border border-zinc-800 hover:bg-zinc-300/85 dark:hover:bg-zinc-900/50 cursor-pointer absolute right-50"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        title="Toggle light mode"
      >
        <motion.div
          className="-rotate-30 p-1.5"
          whileHover={{ scale: 1.2, rotate: 30 }}
          whileTap={{ scale: 1.05, rotate: 10 }}
        >
          {theme === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
        </motion.div>
      </div>
    )
  );
}

export default NavTheme;
