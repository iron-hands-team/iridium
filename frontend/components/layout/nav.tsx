import type { NotificationResponse, NotificationType } from "@/types/notification";
import { getSession } from "@/lib/auth";
import { parseNotification } from "@/lib/helpers";
import NavUser from "./nav-user";
import NavSearch from "./nav-search";
import Notifications from "./notifications";
import Link from "next/link";
import Image from "next/image";

const navLinkStyles = "px-2 py-1.5 text-sm";

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

  const [notificationsRaw, unreadNotificationCount]: [
    NotificationResponse[],
    number,
  ] =
    user && cookie
      ? await Promise.all([
          fetch(`${process.env.INTERNAL_API_URL}/notifications`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.value}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
            .then((res) => res.json())
            .catch(() => []),
          fetch(`${process.env.INTERNAL_API_URL}/notifications/unread-count`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.value}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          })
            .then((res) => res.json())
            .then((data) => data.count as number)
            .catch(() => 0),
        ])
      : [[], 0];

  const notifications: NotificationType[] = notificationsRaw.map(parseNotification);

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
          <Link href="/admin" className={navLinkStyles}>
            Manage
          </Link>
        )}
        {user.role !== "student" && (
          <Link href="/classes" className={navLinkStyles}>
            Classes
          </Link>
        )}
        <Link href="/schedule" className={navLinkStyles}>
          Schedule
        </Link>
        {user.role === "student" && (
          <Link href="/grades" className={navLinkStyles}>
            Grades
          </Link>
        )}
        {user.role === "student" && (
          <Link href="/attendance" className={navLinkStyles}>
            Attendance
          </Link>
        )}
        {user.role === "teacher" && (
          <Link href="/admin/reports" className={navLinkStyles}>
            Report
          </Link>
        )}
        <Link href="/calendar" className={navLinkStyles}>
          Calendar
        </Link>
        <Link href="/clubs" className={navLinkStyles}>
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
        <Link href="/chat" className={navLinkStyles}>
          Chat
        </Link>
        <Notifications
          notifications={notifications}
          unreadCount={unreadNotificationCount}
        />
        <NavUser user={user} />
      </nav>
    </div>
  );
}

export default Nav;