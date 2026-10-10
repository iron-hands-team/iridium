import { getSession } from "@/lib/auth";
import NavUser from "./nav-user";
import NavSearch from "./nav-search";
import Link from "next/link";
import Image from "next/image";

async function Nav() {
  const { user } = await getSession();

  return (
    <div className="sticky top-0 z-10 bg-zinc-100 dark:bg-zinc-950 border-b-1 border-zinc-800">
      <nav className="flex items-center gap-x-4 py-2 px-3 sm:px-10 lg:px-50 max-w-450 mx-auto">
        <Link
          href="/"
          className="text-xl font-bold text-black dark:text-white mr-3 flex items-center gap-x-3"
        >
          <Image
            src="/logo.png"
            alt="Iridium Logo"
            width={27}
            height={27}
            className="invert-100 dark:invert-0"
          />
          Iridium
        </Link>
        <NavSearch />
        {user.role === "admin" && (
          <Link href="/admin" className="px-2 py-1.5">
            Manage
          </Link>
        )}
        {user.role !== "student" && (
          <Link href="/classes" className="px-2 py-1.5">
            Classes
          </Link>
        )}
        <Link href="/schedule" className="px-2 py-1.5">
          Schedule
        </Link>
        {user.role === "student" && (
          <Link href="/grades" className="px-2 py-1.5">
            Grades
          </Link>
        )}
        <Link href="/calendar" className="px-2 py-1.5">
          Calendar
        </Link>
        <Link href="/clubs" className="px-2 py-1.5">
          Clubs
        </Link>
        {/* TODO: add a page for chats? like club chats, teacher emails, etc. */}
        <NavUser user={user} />
      </nav>
    </div>
  );
}

export default Nav;
