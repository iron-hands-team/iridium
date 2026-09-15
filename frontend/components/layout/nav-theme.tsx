"use client";

import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

function NavTheme() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <div onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        {theme === "dark" ? <FaMoon size={20} /> : <FaSun size={20} />}
      </div>
    )
  );
}

export default NavTheme;
