import { getSession } from "@/lib/auth";
import NavUser from "./nav-user";
import NavSearch from "./nav-search";
import Link from "next/link";
import Image from "next/image";

async function Nav() {
  const { user, cookie } = await getSession();

  const unreadCount =
    user && cookie
      ? await fetch(`${process.env.INTERNAL_API_URL}/messages/unread-count`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookie.value}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })
          .then((res) => res.json())
          .then((data) => data.count as number)
          .catch(() => 0)
      : 0;

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
        {user.role === "student" && (
          <Link href="/attendance" className="px-2 py-1.5">
            Attendance
          </Link>
        )}

        {user.role === "teacher" && (
          <Link href="/admin/reports" className="px-2 py-1.5">
            Report
          </Link>
        )}

        <Link href="/calendar" className="px-2 py-1.5">
          Calendar
        </Link>
        <Link href="/clubs" className="px-2 py-1.5">
          Clubs
        </Link>
        <Link
          href="/messages"
          className="px-2 py-1.5 flex items-center gap-x-1"
        >
          Messages
          {unreadCount > 0 && (
            <span className="text-xs bg-red-500 text-white rounded-full px-1.5">
              {unreadCount}
            </span>
          )}
        </Link>
        <Link href="/chat/1" className="px-2 py-1.5">
          {/* TODO: change back to /chat */}
          Chat
        </Link>
        <NavUser user={user} />
      </nav>
    </div>
  );
}

export default Nav;
