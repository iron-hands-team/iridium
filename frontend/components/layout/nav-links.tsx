"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export type NavLink = { href: string; label: string; badge?: number };

const linkStyles = "px-2 py-1.5 text-sm";

function Badge({ count }: { count?: number }) {
  if (!count || count <= 0) return null;
  return (
    <span className="text-xs bg-red-500 text-white rounded-full px-1.5">
      {count}
    </span>
  );
}

function NavLinks({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();

  // close the menu whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* desktop: inline links */}
      <div className="hidden lg:flex items-center gap-x-2">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={linkStyles + " flex items-center gap-x-1"}
          >
            {l.label}
            <Badge count={l.badge} />
          </Link>
        ))}
      </div>

      {/* mobile: hamburger button */}
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="lg:hidden p-2 cursor-pointer"
      >
        {open ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* mobile: dropdown panel under the nav bar */}
      {open && (
        <div className="lg:hidden fixed left-0 right-0 top-[53px] z-20 bg-zinc-100 dark:bg-zinc-950 border-b border-zinc-800 max-h-[calc(100vh-53px)] overflow-y-auto">
          <div className="flex flex-col py-2 px-3 sm:px-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 text-base border-b border-zinc-800/50 last:border-b-0 flex items-center gap-x-2"
              >
                {l.label}
                <Badge count={l.badge} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default NavLinks;